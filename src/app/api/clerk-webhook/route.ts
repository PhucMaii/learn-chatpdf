import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { DrizzleUser, users } from '@/lib/db/schema';
import { daysOfTrial } from '@/lib/constant';
import { transporter } from '@/lib/email';
import { newUser } from '../../../../config/emailTemplate';

const handler = async (req: Request) => {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      'Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local',
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400,
    });
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  const eventType = evt.type;
  let email, firstName;

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, created_at } = evt.data;

    if (!id || !email_addresses) {
      return new Response('Error occured -- no id or email_addresses', {
        status: 400,
      });
    }

    const createdAt = new Date(created_at);
    const trialEnd = new Date(
      createdAt.getTime() + daysOfTrial * 24 * 60 * 60 * 1000,
    );

    email = email_addresses[0]?.email_address;
    firstName = first_name;

    const user = {
      id,
      email: email_addresses[0]?.email_address,
      ...(first_name ? { firstName: first_name } : {}),
      createdAt: new Date(created_at),
      status: 'Trial',
      trialEnd,
    };

    await db.insert(users).values(user as DrizzleUser);

    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject:
        ' 🎉 Welcome to LearnPDF — Let’s Make Studying Smarter Together!',
      text: newUser.replace(/\[First Name\]/g, firstName!),
    });
  }

  return new Response('User Created Successfully', { status: 200 });
};
export const POST = handler;
