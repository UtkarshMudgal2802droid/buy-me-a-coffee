"use client";

import React, { useState, useRef, useEffect } from 'react';
import Hero from '@/components/Hero';
import CreatorCard from '@/components/CreatorCard';
import DonationWidget from '@/components/DonationWidget';
import PraiseBoardWidget from '@/components/PraiseBoardWidget';
import Navbar from '@/components/Navbar';
import * as motion from 'framer-motion/client';

export const CREATORS = [
  {
    id: 0,
    name: "Chilli Labs",
    tagline: "Macro Biology Creator",
    description: "I produce hyper-detailed, 8K macro time-lapse videos tracking the fascinating biological processes of nature.",
    icon: "🌶️",
    supporters: 142,
    members: 28,
    goals: [
      { title: "New Video Equipment", current: 170, max: 200 },
      { title: "Hire a Video Editor", current: 50, max: 500 }
    ]
  },
  {
    id: 1,
    name: "Alice Art",
    tagline: "Digital Illustrator",
    description: "Creating vibrant, dream-like digital landscapes and sharing my Procreate brushes with the community.",
    icon: "🎨",
    supporters: 89,
    members: 15,
    goals: [
      { title: "iPad Pro Upgrade", current: 80, max: 150 },
      { title: "Artbook Printing", current: 10, max: 300 }
    ]
  },
  {
    id: 2,
    name: "Bob Beats",
    tagline: "Lofi Music Producer",
    description: "Making relaxing lofi beats to study and code to. Help me fund my next studio album!",
    icon: "🎧",
    supporters: 312,
    members: 64,
    goals: [
      { title: "Studio Monitors", current: 300, max: 400 },
      { title: "Vinyl Pressing", current: 150, max: 1000 }
    ]
  }
];

export default function Home() {
  const [activeCreatorId, setActiveCreatorId] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Use Intersection Observer to detect which card is currently in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number(entry.target.getAttribute('data-id'));
            setActiveCreatorId(id);
          }
        });
      },
      { root: scrollContainerRef.current, threshold: 0.6 }
    );

    const cards = document.querySelectorAll('.creator-slide');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const activeCreator = CREATORS[activeCreatorId];

  return (
    <main className="w-full min-h-screen relative overflow-hidden bg-transparent">
      {/* We removed the static background blobs because InteractiveBackground is now in layout.tsx */}
      <Navbar />
      
      {/* Section 1: Hero */}
      <section id="home" className="w-full min-h-screen flex items-center justify-center pt-32 pb-20 px-6 relative z-10">
        <Hero />
      </section>

      {/* Section 2: Creator Carousel & Donation Side-by-Side */}
      <section id="demo" className="w-full min-h-screen flex flex-col justify-center py-20 px-6 relative z-10">
        
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-bmc-dark font-serif italic">Discover Creators</h2>
          <p className="text-slate-600 mt-2 font-medium">Swipe to explore. Fund their goals directly.</p>
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch perspective-1000">
          
          {/* Left Column: Creator Carousel */}
          <div className="flex flex-col items-center">
            <div 
              ref={scrollContainerRef}
              className="w-full max-w-md flex overflow-x-auto snap-x snap-mandatory custom-scrollbar pb-6 gap-8"
              style={{ scrollBehavior: 'smooth' }}
            >
              {CREATORS.map((creator) => (
                <div 
                  key={creator.id} 
                  data-id={creator.id}
                  className="w-full max-w-md flex-none snap-center creator-slide"
                >
                  <CreatorCard creator={creator} />
                </div>
              ))}
            </div>
            {/* Carousel Indicators */}
            <div className="flex gap-2 mt-4">
              {CREATORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    const slide = document.querySelector(`[data-id="${c.id}"]`);
                    slide?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${activeCreatorId === c.id ? 'bg-bmc-yellow scale-125' : 'bg-slate-300'}`}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Donation Widget tied to active creator */}
          <div className="flex justify-start">
            <div className="w-full max-w-md">
              <DonationWidget creatorName={activeCreator.name} />
            </div>
          </div>
          
        </div>

        {/* Ledger History tied to active creator */}
        <div className="mt-20">
          <PraiseBoardWidget creatorName={activeCreator.name} />
        </div>
      </section>

    </main>
  );
}
