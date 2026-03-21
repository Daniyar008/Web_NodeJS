import { Request, Response } from 'express';
import { prisma } from '../index';
import { SubscriptionPlan } from '@prisma/client';

export const createCheckoutSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { planType, institutionId, courseId } = req.body;

    // In a real application, this would call Stripe API to generate a checkout session URL
    // const session = await stripe.checkout.sessions.create({...})

    res.json({
      url: 'https://checkout.stripe.com/pay/cs_test_mock_url',
      message: 'This is a mock checkout session URL. Stripe integration requires actual keys.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating checkout session', error });
  }
};

export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    // This endpoint would receive Stripe webhook events to update subscription statuses in DB
    const event = req.body; // Normally parsed with Stripe library

    console.log('Received mock stripe webhook event:', event.type);

    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ message: 'Webhook handler error', error });
  }
};

export const updateInstitutionSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const { institutionId } = req.params as { institutionId: string };
    const { plan } = req.body;

    const updated = await prisma.institution.update({
      where: { id: institutionId },
      data: {
        subscription: plan as SubscriptionPlan,
        subscriptionEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating subscription', error });
  }
};
