import type Stripe from "stripe";

import { env } from "../../config/env.js";
import { ApiError } from "../../lib/apiError.js";
import { prisma } from "../../lib/prisma.js";
import { createNotification } from "../notification/notification.service.js";
import type {
  CreateCourseCheckoutDto,
  CreateSubscriptionCheckoutDto,
  UpdateCoursePricingDto,
  WebhookEventDto,
} from "./payment.schema.js";

let stripeClient: Stripe | null = null;

async function getStripe(): Promise<Stripe | null> {
  if (!env.STRIPE_SECRET_KEY) return null;
  if (stripeClient) return stripeClient;

  const StripeCtor = (await import("stripe")).default;
  stripeClient = new StripeCtor(env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-03-25.dahlia",
  });
  return stripeClient;
}

function clean<T extends object>(obj: T): any {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));
}

export async function ensureDefaultPlans() {
  const defaults = [
    {
      id: "plan_basic_monthly",
      name: "Basic Monthly",
      description: "Базовый доступ для учреждения",
      priceCents: 990,
      interval: "MONTHLY" as const,
    },
    {
      id: "plan_pro_monthly",
      name: "Pro Monthly",
      description: "Расширенная аналитика и приоритетная поддержка",
      priceCents: 2990,
      interval: "MONTHLY" as const,
    },
    {
      id: "plan_pro_yearly",
      name: "Pro Yearly",
      description: "Годовой тариф со скидкой",
      priceCents: 29900,
      interval: "YEARLY" as const,
    },
  ];

  await prisma.$transaction(
    defaults.map((plan) =>
      prisma.subscriptionPlan.upsert({
        where: { id: plan.id },
        create: {
          ...plan,
          currency: env.STRIPE_DEFAULT_CURRENCY.toUpperCase(),
        },
        update: {
          name: plan.name,
          description: plan.description,
          priceCents: plan.priceCents,
          interval: plan.interval,
          currency: env.STRIPE_DEFAULT_CURRENCY.toUpperCase(),
          isActive: true,
        },
      })
    )
  );
}

export async function listPlans() {
  await ensureDefaultPlans();
  return prisma.subscriptionPlan.findMany({
    where: { isActive: true },
    orderBy: [{ priceCents: "asc" }, { name: "asc" }],
  });
}

export async function getMySubscription(userId: string) {
  return prisma.subscription.findFirst({
    where: { userId, status: { in: ["ACTIVE", "TRIALING", "PAST_DUE"] } },
    include: { plan: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function hasActiveSubscription(userId: string) {
  const current = await prisma.subscription.findFirst({
    where: { userId, status: { in: ["ACTIVE", "TRIALING"] } },
  });
  return Boolean(current);
}

export async function createSubscriptionCheckout(userId: string, dto: CreateSubscriptionCheckoutDto) {
  await ensureDefaultPlans();
  const plan = await prisma.subscriptionPlan.findUnique({ where: { id: dto.planId } });
  if (!plan || !plan.isActive) throw ApiError.notFound("Plan not found");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw ApiError.notFound("User not found");

  const stripe = await getStripe();
  const successUrl = dto.successUrl ?? `${env.FRONTEND_URL}/pricing?status=success`;
  const cancelUrl = dto.cancelUrl ?? `${env.FRONTEND_URL}/pricing?status=cancel`;

  if (stripe && plan.stripePriceId) {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: user.email,
      metadata: {
        type: "subscription",
        userId,
        planId: plan.id,
      },
      line_items: [{ price: plan.stripePriceId, quantity: 1 }],
    });

    return { checkoutUrl: session.url, provider: "stripe" as const };
  }

  await prisma.subscription.upsert({
    where: { id: `mock-sub-${userId}` },
    create: {
      id: `mock-sub-${userId}`,
      userId,
      planId: plan.id,
      status: "ACTIVE",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    update: {
      planId: plan.id,
      status: "ACTIVE",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  return { checkoutUrl: successUrl, provider: "mock" as const };
}

export async function cancelMySubscription(userId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: { userId, status: { in: ["ACTIVE", "TRIALING", "PAST_DUE"] } },
    orderBy: { updatedAt: "desc" },
  });
  if (!subscription) throw ApiError.notFound("Active subscription not found");

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: { status: "CANCELED", cancelAtPeriodEnd: true },
  });
}

export async function listMarketplaceCourses(userId: string) {
  return prisma.course.findMany({
    where: {
      status: "PUBLISHED",
      isPaid: true,
      priceCents: { gt: 0 },
      authorId: { not: userId },
    },
    include: {
      author: { select: { id: true, firstName: true, lastName: true } },
      _count: { select: { enrollments: true, modules: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function updateCoursePricing(authorId: string, courseId: string, dto: UpdateCoursePricingDto) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw ApiError.notFound("Course not found");
  if (course.authorId !== authorId) throw ApiError.forbidden("Not your course");

  if (dto.isPaid && dto.priceCents <= 0) {
    throw ApiError.badRequest("Paid course must have positive price");
  }

  return prisma.course.update({
    where: { id: courseId },
    data: {
      isPaid: dto.isPaid,
      priceCents: dto.isPaid ? dto.priceCents : 0,
      currency: dto.currency.toUpperCase(),
    },
  });
}

export async function createCourseCheckout(userId: string, courseId: string, dto: CreateCourseCheckoutDto) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { author: { select: { id: true, firstName: true, lastName: true, email: true } } },
  });
  if (!course) throw ApiError.notFound("Course not found");
  if (!course.isPaid || course.priceCents <= 0) throw ApiError.conflict("Course is not paid");
  if (course.authorId === userId) throw ApiError.forbidden("Cannot buy your own course");

  const existingSuccess = await prisma.coursePurchase.findUnique({ where: { userId_courseId: { userId, courseId } } });
  if (existingSuccess?.status === "SUCCEEDED") throw ApiError.conflict("Course already purchased");

  const purchase = existingSuccess
    ? await prisma.coursePurchase.update({
        where: { id: existingSuccess.id },
        data: {
          amountCents: course.priceCents,
          currency: course.currency,
          status: "PENDING",
        },
      })
    : await prisma.coursePurchase.create({
        data: {
          userId,
          courseId,
          amountCents: course.priceCents,
          currency: course.currency,
          status: "PENDING",
        },
      });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw ApiError.notFound("User not found");

  const stripe = await getStripe();
  const successUrl = dto.successUrl ?? `${env.FRONTEND_URL}/billing?status=success`;
  const cancelUrl = dto.cancelUrl ?? `${env.FRONTEND_URL}/billing?status=cancel`;

  if (stripe) {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: user.email,
      metadata: {
        type: "course_purchase",
        purchaseId: purchase.id,
        courseId: course.id,
        userId,
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: course.currency.toLowerCase(),
            unit_amount: course.priceCents,
            product_data: { name: course.title },
          },
        },
      ],
    });

    await prisma.coursePurchase.update({
      where: { id: purchase.id },
      data: {
        stripeCheckoutSessionId: session.id,
      },
    });

    return { checkoutUrl: session.url, provider: "stripe" as const };
  }

  await finalizeCoursePurchase(purchase.id, undefined);
  return { checkoutUrl: successUrl, provider: "mock" as const };
}

export async function listPurchaseHistory(userId: string) {
  return prisma.coursePurchase.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          author: { select: { id: true, firstName: true, lastName: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function listTeacherCommissions(teacherId: string) {
  return prisma.commissionTransaction.findMany({
    where: { teacherId },
    include: {
      course: { select: { id: true, title: true } },
      purchase: {
        select: {
          id: true,
          createdAt: true,
          user: { select: { id: true, firstName: true, lastName: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBillingAccess(userId: string) {
  return {
    hasActiveSubscription: await hasActiveSubscription(userId),
    canAccessPremiumAnalytics: await hasActiveSubscription(userId),
    canCreatePaidCourses: true,
  };
}

export async function processWebhookEvent(event: WebhookEventDto) {
  if (event.type === "checkout.session.completed") {
    const object = event.data.object;
    const metadata = (object["metadata"] as Record<string, string> | undefined) ?? {};

    if (metadata["type"] === "subscription") {
      const userId = metadata["userId"];
      const planId = metadata["planId"];
      if (userId && planId) {
        await prisma.subscription.create({
          data: clean({
            userId,
            planId,
            status: "ACTIVE",
            stripeCustomerId: typeof object["customer"] === "string" ? object["customer"] : undefined,
            stripeSubscriptionId: typeof object["subscription"] === "string" ? object["subscription"] : undefined,
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          }),
        }).catch(async () => {
          await prisma.subscription.updateMany({
            where: { userId },
            data: {
              planId,
              status: "ACTIVE",
              currentPeriodStart: new Date(),
              currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
          });
        });
      }
      return;
    }

    if (metadata["type"] === "course_purchase" && metadata["purchaseId"]) {
      await finalizeCoursePurchase(metadata["purchaseId"], typeof object["payment_intent"] === "string" ? object["payment_intent"] : undefined);
      return;
    }
  }

  if (event.type === "invoice.payment_failed") {
    const object = event.data.object;
    const stripeSubscriptionId = typeof object["subscription"] === "string" ? object["subscription"] : undefined;
    if (!stripeSubscriptionId) return;
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId },
      data: { status: "PAST_DUE" },
    });
  }
}

async function finalizeCoursePurchase(purchaseId: string, paymentIntentId?: string) {
  const purchase = await prisma.coursePurchase.findUnique({
    where: { id: purchaseId },
    include: { course: true, user: true },
  });
  if (!purchase) return;
  if (purchase.status === "SUCCEEDED") return;

  const platformFeeCents = Math.round((purchase.amountCents * env.PLATFORM_FEE_BPS) / 10000);
  const teacherAmountCents = purchase.amountCents - platformFeeCents;

  await prisma.$transaction(async (tx) => {
    await tx.coursePurchase.update({
      where: { id: purchase.id },
      data: {
        status: "SUCCEEDED",
        ...(paymentIntentId ? { stripePaymentIntentId: paymentIntentId } : {}),
      },
    });

    await tx.commissionTransaction.upsert({
      where: { purchaseId: purchase.id },
      create: {
        teacherId: purchase.course.authorId,
        courseId: purchase.courseId,
        purchaseId: purchase.id,
        grossAmountCents: purchase.amountCents,
        platformFeeCents,
        teacherAmountCents,
        status: "PENDING",
      },
      update: {
        grossAmountCents: purchase.amountCents,
        platformFeeCents,
        teacherAmountCents,
      },
    });
  });

  await createNotification({
    userId: purchase.userId,
    title: `Покупка курса подтверждена`,
    body: `Курс ${purchase.course.title} теперь доступен в вашем кабинете.`,
    type: "SYSTEM",
    link: `/learn/${purchase.courseId}`,
  });

  await createNotification({
    userId: purchase.course.authorId,
    title: `Новая продажа курса`,
    body: `${purchase.user.firstName} ${purchase.user.lastName} приобрёл(а) курс ${purchase.course.title}.`,
    type: "SYSTEM",
    link: "/billing",
  });
}
