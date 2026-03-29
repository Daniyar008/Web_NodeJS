import type { AxiosResponse } from "axios";

import { api } from "../../lib/api";

export type BillingInterval = "MONTHLY" | "YEARLY" | "ONE_TIME";
export type SubscriptionStatus = "ACTIVE" | "CANCELED" | "PAST_DUE" | "TRIALING";
export type PaymentStatus = "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED";

export type SubscriptionPlan = {
  id: string;
  name: string;
  description: string | null;
  priceCents: number;
  currency: string;
  interval: BillingInterval;
  stripePriceId: string | null;
  isActive: boolean;
};

export type Subscription = {
  id: string;
  status: SubscriptionStatus;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  plan: SubscriptionPlan;
};

export type MarketplaceCourse = {
  id: string;
  title: string;
  description: string | null;
  isPaid: boolean;
  priceCents: number;
  currency: string;
  author: { id: string; firstName: string; lastName: string };
  _count: { enrollments: number; modules: number };
};

export type CoursePurchase = {
  id: string;
  status: PaymentStatus;
  amountCents: number;
  currency: string;
  createdAt: string;
  course: {
    id: string;
    title: string;
    author: { id: string; firstName: string; lastName: string };
  };
};

export type CommissionTransaction = {
  id: string;
  grossAmountCents: number;
  platformFeeCents: number;
  teacherAmountCents: number;
  status: "PENDING" | "PAID";
  paidAt: string | null;
  createdAt: string;
  course: { id: string; title: string };
  purchase: {
    id: string;
    createdAt: string;
    user: { id: string; firstName: string; lastName: string };
  };
};

export const paymentApi = {
  plans: () => api.get<SubscriptionPlan[]>("/payments/plans").then((response: AxiosResponse<SubscriptionPlan[]>) => response.data),
  mySubscription: () =>
    api.get<Subscription | null>("/payments/subscription").then((response: AxiosResponse<Subscription | null>) => response.data),
  billingAccess: () =>
    api
      .get<{ hasActiveSubscription: boolean; canAccessPremiumAnalytics: boolean; canCreatePaidCourses: boolean }>("/payments/access")
      .then((response: AxiosResponse<{ hasActiveSubscription: boolean; canAccessPremiumAnalytics: boolean; canCreatePaidCourses: boolean }>) => response.data),
  subscriptionCheckout: (planId: string) =>
    api
      .post<{ checkoutUrl: string | null; provider: "stripe" | "mock" }>("/payments/checkout/subscription", { planId })
      .then((response: AxiosResponse<{ checkoutUrl: string | null; provider: "stripe" | "mock" }>) => response.data),
  cancelSubscription: () => api.post("/payments/subscription/cancel"),

  marketplace: () =>
    api.get<MarketplaceCourse[]>("/payments/marketplace").then((response: AxiosResponse<MarketplaceCourse[]>) => response.data),
  courseCheckout: (courseId: string) =>
    api
      .post<{ checkoutUrl: string | null; provider: "stripe" | "mock" }>(`/payments/checkout/course/${courseId}`, {})
      .then((response: AxiosResponse<{ checkoutUrl: string | null; provider: "stripe" | "mock" }>) => response.data),
  purchases: () =>
    api.get<CoursePurchase[]>("/payments/purchases").then((response: AxiosResponse<CoursePurchase[]>) => response.data),
  commissions: () =>
    api
      .get<CommissionTransaction[]>("/payments/commissions")
      .then((response: AxiosResponse<CommissionTransaction[]>) => response.data),
  updateCoursePricing: (courseId: string, payload: { isPaid: boolean; priceCents: number; currency: string }) =>
    api.patch(`/payments/courses/${courseId}/pricing`, payload).then((response: AxiosResponse<unknown>) => response.data),
};
