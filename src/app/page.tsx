import React from 'react';
import Hero from '@/components/Hero';
import DeckOfCards from '@/components/DeckOfCards';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <main className="w-full min-h-screen">
      {/* Dynamic Ambient Background */}
      <div className="ambient-mesh">
        <div className="ambient-orb orb-1"></div>
        <div className="ambient-orb orb-2"></div>
        <div className="ambient-orb orb-3"></div>
      </div>

      <Navbar />
      
      {/* Section 1: Hero */}
      <section id="home" className="w-full min-h-screen flex items-center justify-center pt-32 pb-20 px-6 relative z-10">
        <Hero />
      </section>

      {/* Section 2: Deck of Cards Interactive UI */}
      <section id="demo" className="w-full min-h-screen flex flex-col items-center justify-center py-20 px-6 relative z-10 overflow-hidden">
        <div className="text-center mb-16 relative z-20">
          <h2 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter text-wild-gradient">
            The Creator Deck
          </h2>
          <p className="text-slate-600 text-xl font-bold max-w-2xl mx-auto">
            Click a card to send it to the back. Tip, connect, and explore the ledger all in one interactive spot.
          </p>
        </div>
        
        <DeckOfCards />
      </section>

    </main>
  );
}
