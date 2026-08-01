import React from 'react';
import Hero from '@/components/Hero';
import HybridFeatureCards from '@/components/HybridFeatureCards';
import CreatorCard from '@/components/CreatorCard';
import DonationWidget from '@/components/DonationWidget';
import PraiseBoardWidget from '@/components/PraiseBoardWidget';
import HorizontalScrollProvider from '@/components/HorizontalScrollProvider';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <main className="w-full bg-[#030712]">
      {/* Dynamic Ambient Background */}
      <div className="ambient-mesh">
        <div className="ambient-orb orb-1"></div>
        <div className="ambient-orb orb-2"></div>
        <div className="ambient-orb orb-3"></div>
      </div>

      <Navbar />
      <HorizontalScrollProvider>
        
        {/* Section 1: Hero */}
        <section id="home" className="w-[100vw] h-screen flex-shrink-0 flex items-center justify-center pt-20 px-6">
          <Hero />
        </section>

        {/* Section 2: Features */}
        <section id="features" className="w-[100vw] h-screen flex-shrink-0 flex items-center justify-center px-6 relative">
          <HybridFeatureCards />
        </section>

        {/* Section 3: Creator Demo */}
        <section id="demo" className="w-[100vw] h-screen flex-shrink-0 flex items-center justify-center px-6 relative">
          <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">
                Creator Demo
              </h2>
              <p className="text-[#737373] text-lg max-w-xl mx-auto font-medium">
                Sleek, frictionless tipping integrated seamlessly.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
              <div className="lg:col-span-7 flex justify-center">
                <CreatorCard />
              </div>
              <div className="lg:col-span-5 flex justify-center">
                <DonationWidget />
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Praise Board */}
        <section id="praise-board" className="w-[100vw] h-screen flex-shrink-0 flex items-center justify-center px-6 relative">
          <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">
                The Ledger
              </h2>
              <p className="text-[#737373] text-lg max-w-xl mx-auto font-medium">
                Immutable support, etched onto Sepolia.
              </p>
            </div>
            <div className="w-full">
              <PraiseBoardWidget />
            </div>
          </div>
        </section>

      </HorizontalScrollProvider>
    </main>
  );
}
