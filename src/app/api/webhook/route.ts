import { db } from "@/lib/db";
import { userSubscriptions } from "@/lib/db/schema";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();

    const signature = headers().get('Stripe-Signature') as string;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET as string);
    } catch (error: any) {
        console.log(error);
        return new NextResponse('webhook error', {status: 400});
    }

    const session = event.data.object as Stripe.Checkout.Session;

    // new subscription
    if (event.type === 'checkout.session.completed') {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        if (!session?.metadata?.userId) {
            return new NextResponse('No User Id', {status: 400});
        }

        await db.insert(userSubscriptions).values({
            userId: session.metadata.userId,
            stripeCustomerId: subscription.customer as string,
            stripeSubscriptionId: subscription.id as string,
            stripePriceId: subscription.items.data[0].price.id
        });
    }
}