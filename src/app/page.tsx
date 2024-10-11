import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import {ArrowRight, LogIn} from 'lucide-react';
import FileUpload from "@/components/FileUpload";
import { checkSubscription } from "@/lib/subscription";
import SubscriptionButton from "@/components/SubscriptionButton";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function Home() {
  const {userId} = await auth();

  const isAuth = !!userId;

  const isPro = await checkSubscription();
  let firstChat;

  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId));

    if (firstChat) {
      firstChat = firstChat[0];
    }
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-tr from-gray-700 via-gray-900 to-black">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold text-white">Chat with any PDF</h1>
            <UserButton />
          </div>
            <p className="max-w-xl mt-2 text-lg text-slate-600">Join millions of students, researchers and professionals to instantly answer questions and understand research with AI.</p>

          <div className="flex mt-2 items-center">
            {
              isAuth && firstChat && 
              <Link href={`/chat/${firstChat.id}`}>
                <Button className="bg-white text-black font-bold my-2">Go to Chats <ArrowRight className="w-4 h-4 ml-2" /></Button>
              </Link>
            }
            <div className="ml-3">
              <SubscriptionButton isPro={isPro} />
            </div>
          </div>


          <div className="w-full mt-4">
            {
              isAuth ? (
                <FileUpload />
              ) : (
                <Link href="/sign-in">
                  <Button>
                    Login to Get Started! <LogIn className="w-4 h-4 ml-2" />
                    </Button>
                </Link>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}
