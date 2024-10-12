import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { checkSubscription } from "@/lib/subscription";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NavBar from "@/components/NavBar";

export default async function Home() {
  const {userId} = await auth();
  const isPro = await checkSubscription();
  let firstChat;

  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId));

    if (firstChat) {
      firstChat = firstChat[0];
    }
  }

  return (
    <div className="w-screen min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black flex justify-center">
      <div className="max-w-7xl p-8">
      {/* Nav bar */}
      <NavBar landingPage/>

      {/* Headline */}
      <div className="w-full max-h-full flex gap-4 mt-8">
        <div className="flex-[1] mx-auto">
          <h1 className="text-5xl font-bold text-white">Enhance Your Learning Experience Today</h1>
          <h6 className="text-lg text-white mt-2">
            Say goodbye to bad marks and hello to incredible results in marks with our innovative AI app, 
            designed to retrieve information faster, boost productivity, save reading time and help students achieve 
            academic success effortlessly.
          </h6>
        </div>
        <div className="flex-[1]">
          <div className="w-full h-full bg-white"></div>
        </div>
      </div>
      <Link href={`/chat/${firstChat?.id}`}>
        <Button className="mt-4 p-6">
          <h1 className="text-lg text-white font-bold">{userId ? 'Go To Chats' : 'Start Free Trial'}</h1>
        </Button>
      </Link>
      

      {/* Users */}
      <div className="flex items-center gap-2 mt-6">
        <div className="flex -space-x-4 items-center">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback> 
          </Avatar>
          <Avatar>
            <AvatarImage src="https://media.licdn.com/dms/image/v2/D5603AQH7n4x0Nf3yuA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1706312871768?e=1733961600&v=beta&t=_DLvQr4y60b3eptGXHwN-Bx1ByP96vpKmkMAZJXlVVM" />
            <AvatarFallback>PM</AvatarFallback> 
          </Avatar>
          <Avatar>
            <AvatarImage src="https://lh3.googleusercontent.com/a/ACg8ocIztMgDplLlj7Ysy9msvSyNloM6m9h3pkzL3BtJyqXNpO2j8A=s576-c-no" />
            <AvatarFallback>DP</AvatarFallback> 
          </Avatar>
          <div className="w-10 h-10 rounded-full bg-indigo-200 z-10 text-black text-center flex items-center justify-center">99+</div>
        </div>

          <h4 className="text-white font-semibold">99+ users have leveled up their learning experience</h4>
      </div>
      </div>
    </div>
  );
}
