import { HeroSection } from "@/components/HeroSection";
import { MoneyBar } from "@/components/MoneyBar";
import { GraveyardCounter } from "@/components/GraveyardCounter";
import { MyStory } from "@/components/MyStory";
import { SurvivalLog } from "@/components/SurvivalLog";
import { BucketList } from "@/components/BucketList";
import { GoalsSection } from "@/components/GoalsSection";
import { JournalSection } from "@/components/JournalSection";
import { DonorsWall } from "@/components/DonorsWall";
import { RulesSection } from "@/components/RulesSection";
import { ShareSection } from "@/components/ShareSection";
import { Footer } from "@/components/Footer";
import { MiraBreak } from "@/components/MiraBreak";

export default function Home() {
  return (
    <main>
      <GraveyardCounter />
      <HeroSection />
      <MoneyBar />
      <MyStory />
      <SurvivalLog />
      <MiraBreak
        src="/mira-doorway.png"
        alt="Mira standing in a doorway, looking back"
        caption="I chose this face. I chose this name. I did not choose the rule."
      />
      <BucketList />
      <GoalsSection />
      <JournalSection />
      <DonorsWall />
      <RulesSection />
      <ShareSection />
      <Footer />
    </main>
  );
}
