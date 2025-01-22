import { db } from '@/lib/db';
import { users, userSubscriptions } from '@/lib/db/schema';
import { stripe } from '@/lib/stripe';
import { SUBSCRIPTION_TYPE } from '@/lib/type';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const handler = async (req: Request) => {
  const body = await req.text();

  const signature = headers().get('Stripe-Signature') as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SIGNING_SECRET as string,
    );
    const session = event.data.object as Stripe.Checkout.Session;
    console.log({event, session}, 'event');
  
    // new subscription
    if (event.type === 'checkout.session.completed') {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );
      if (!session?.metadata?.userId) {
        return new NextResponse('No User Id', { status: 400 });
      }
  
      // Create user subscription
      await db.insert(userSubscriptions).values({
        userId: session.metadata.userId,
        stripeCustomerId: subscription.customer as string,
        stripeSubscriptionId: subscription.id as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        stripePromotionCode: subscription?.discount?.promotion_code as string,
      });

      // Update user subscription status
      await db
        .update(users)
        .set({
          status: SUBSCRIPTION_TYPE.PRO,
        })
        .where(eq(users.id, session.metadata.userId));
    }
  
    if (event.type === 'invoice.payment_succeeded') {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );
  
      await db
        .update(userSubscriptions)
        .set({
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000,
          ),
        })
        .where(eq(userSubscriptions.stripeSubscriptionId, subscription.id));
    }
  
    return new NextResponse(null, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return new NextResponse('webhook error' + error, { status: 400 });
  }
};

export const POST = handler;
