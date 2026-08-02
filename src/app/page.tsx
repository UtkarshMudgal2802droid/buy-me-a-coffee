import React from 'react';
import Hero from '@/components/Hero';
import CreatorCard from '@/components/CreatorCard';
import DonationWidget from '@/components/DonationWidget';
import PraiseBoardWidget from '@/components/PraiseBoardWidget';
import Navbar from '@/components/Navbar';
import MouseParallaxBackground from '@/components/MouseParallaxBackground';

export default function Home() {
  return (
    <main className="w-full min-h-screen relative">
      {/* Advanced Interactive Mouse Parallax Background */}
      <MouseParallaxBackground />

      <Navbar />
      
      {/* Section 1: Hero */}
      <section id="home" className="w-full min-h-screen flex items-center justify-center pt-32 pb-20 px-6 relative z-10">
        <Hero />
      </section>

      {/* Section 2: Creator Profile & Donation Side-by-Side */}
      <section id="demo" className="w-full min-h-screen flex flex-col justify-center py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
          
          {/* Left Column: Creator Profile */}
          <div className="flex justify-end">
            <div className="w-full max-w-md h-[550px]">
              <CreatorCard />
            </div>
          </div>

          {/* Right Column: Donation Widget */}
          <div className="flex justify-start">
            <div className="w-full max-w-md h-[550px]">
              <DonationWidget />
            </div>
          </div>
          
        </div>

        {/* Ledger History placed below */}
        <PraiseBoardWidget />
      </section>

    </main>
  );
}
