import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import NavBar from '@/components/NavBar';
import Introduction from '@/components/Landing/Introduction';
import Features from '@/components/Landing/Features';
import FeatureDetails from '@/components/Landing/FeatureDetails';
import Gain from '@/components/Landing/Gain';
import InvitationCard from '@/components/Landing/InvitationCard';
import Footer from '@/components/Landing/Footer';

export default async function Home() {
  const { userId } = await auth();
  let firstChat;

  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId));

    if (firstChat) {
      firstChat = firstChat[0];
    }
  }

  return (
    <div className="max-w-screen min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black flex justify-center">
      <div className="py-8 w-full m-0">
        {/* Nav bar */}
        <NavBar landingPage />
        <Introduction userId={userId} />
        <Features />
        <FeatureDetails />
        <Gain />
        <div className="bg-white w-full p-16">
          <InvitationCard />
        </div>
        <Footer />
      </div>
    </div>
  );
}
