import React from 'react';
import Hero from '@/components/Hero';
import HybridFeatureCards from '@/components/HybridFeatureCards';
import CreatorCard from '@/components/CreatorCard';
import DonationWidget from '@/components/DonationWidget';
import PraiseBoardWidget from '@/components/PraiseBoardWidget';

export default function Home() {
  return (
    <main className="flex flex-col w-full min-h-screen">
      
      {/* Hero Section */}
      <section id="home" className="min-h-screen pt-20">
        <Hero />
      </section>

      {/* Features Section */}
      <section id="features" className="min-h-screen py-20 relative flex items-center">
        <HybridFeatureCards />
      </section>

      {/* Creator Demo Section */}
      <section id="demo" className="min-h-screen py-20 relative flex items-center">
        <div className="container mx-auto px-6 z-10 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-electric-purple to-cyber-blue">
              Creator Demo
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              This is how your profile will look to supporters.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7">
              <CreatorCard />
            </div>
            <div className="lg:col-span-5">
              <DonationWidget />
            </div>
          </div>
        </div>
      </section>

      {/* Praise Board Section */}
      <section id="praise-board" className="min-h-screen py-20 relative flex items-center">
        <div className="container mx-auto px-6 z-10 w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-warm-amber to-orange-500">
              The Real Test
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Connect your Sepolia testnet wallet below and send a real transaction to our Smart Contract.
            </p>
          </div>
          <PraiseBoardWidget />
        </div>
      </section>

    </main>
  );
}
