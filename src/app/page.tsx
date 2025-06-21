import NavBar from '@/components/NavBar';
import Introduction from '@/components/Landing/Introduction';
import Features from '@/components/Landing/Features';
import FeatureDetails from '@/components/Landing/FeatureDetails';
import Gain from '@/components/Landing/Gain';
import InvitationCard from '@/components/Landing/InvitationCard';
import Footer from '@/components/Landing/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Home | LearnPDF"

}

export default async function Home() {
  // const { userId } = await auth();
  // let firstChat;

  // if (userId) {
  //   firstChat = await db.select().from(chats).where(eq(chats.userId, userId));

  //   if (firstChat) {
  //     firstChat = firstChat[0];
  //   }
  // }

  return (
    // <div className="max-w-screen min-h-screen bg-[radial-gradient(ellipse_at_center,_#374151,_#111827,_#000000)] flex justify-center">
    <div className="max-w-[1400px] mx-auto min-h-screen flex justify-center">
      <div className="py-8 px-8 flex flex-col gap-16 w-full m-0 overflow-x-hdiden">
        {/* Nav bar */}
        <NavBar />
        <Introduction />
        <Features />
        <FeatureDetails />
        <Gain />
        <div className={`w-full p-16`}>
          <InvitationCard />
        </div>
        <Footer />
      </div>
    </div>
  );
}
