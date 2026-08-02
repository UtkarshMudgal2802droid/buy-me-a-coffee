"use client";

import React, { useState, useRef, useEffect } from 'react';
import Hero from '@/components/Hero';
import CreatorCard from '@/components/CreatorCard';
import DonationWidget from '@/components/DonationWidget';
import PraiseBoardWidget from '@/components/PraiseBoardWidget';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

export const CREATORS = [
  {
    id: 0,
    name: "Ifeoma",
    tagline: "City Bus Timetables",
    description: "I keep our city's bus timetables online so 9,000 commuters can check them before they leave the house every morning. Your support covers hosting!",
    icon: "🚌",
    supporters: 914,
    members: 120,
    goals: [
      { title: "Server Hosting (Yearly)", current: 180, max: 200 },
      { title: "Domain Renewal", current: 15, max: 50 }
    ]
  },
  {
    id: 1,
    name: "Marcus",
    tagline: "Subway Accessibility Maps",
    description: "I map out working elevators and accessible routes across the subway network for commuters with disabilities.",
    icon: "🗺️",
    supporters: 412,
    members: 45,
    goals: [
      { title: "App Development", current: 400, max: 1000 },
      { title: "Database Hosting", current: 50, max: 100 }
    ]
  },
  {
    id: 2,
    name: "Transit Watch",
    tagline: "Real-time Train Delays",
    description: "An independent tracker logging real-time train delays and platform changes. We rely entirely on commuter tips to keep the API running.",
    icon: "🚆",
    supporters: 1250,
    members: 310,
    goals: [
      { title: "API Usage Fees", current: 800, max: 1000 },
      { title: "New Web Dashboard", current: 120, max: 500 }
    ]
  }
];

export default function Home() {
  const [activeCreatorId, setActiveCreatorId] = useState(0);

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      setActiveCreatorId((prev) => (prev > 0 ? prev - 1 : CREATORS.length - 1));
    } else if (info.offset.x < -swipeThreshold) {
      setActiveCreatorId((prev) => (prev < CREATORS.length - 1 ? prev + 1 : 0));
    }
  };

  const activeCreator = CREATORS[activeCreatorId];

  return (
    <main className="w-full min-h-screen relative overflow-hidden bg-transparent">
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

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch perspective-1000 overflow-hidden">
          
          {/* Left Column: Advanced Coverflow Carousel */}
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-md h-[550px] flex items-center justify-center">
              <AnimatePresence initial={false}>
                {CREATORS.map((creator, index) => {
                  const isActive = index === activeCreatorId;
                  const isPrev = index === (activeCreatorId - 1 + CREATORS.length) % CREATORS.length;
                  const isNext = index === (activeCreatorId + 1) % CREATORS.length;
                  
                  // Only render the active, previous, and next cards to save DOM elements
                  if (!isActive && !isPrev && !isNext && CREATORS.length > 3) return null;

                  let xOffset = 0;
                  let zIndex = 0;
                  let scale = 1;
                  let opacity = 1;
                  let rotateY = 0;
                  let filter = "blur(0px)";

                  if (isActive) {
                    zIndex = 10;
                  } else if (isPrev) {
                    xOffset = -60;
                    zIndex = 5;
                    scale = 0.85;
                    opacity = 0.4;
                    rotateY = 15;
                    filter = "blur(4px)";
                  } else if (isNext) {
                    xOffset = 60;
                    zIndex = 5;
                    scale = 0.85;
                    opacity = 0.4;
                    rotateY = -15;
                    filter = "blur(4px)";
                  }

                  return (
                    <motion.div
                      key={creator.id}
                      className="absolute w-full h-full cursor-grab active:cursor-grabbing"
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      onDragEnd={handleDragEnd}
                      initial={false}
                      animate={{
                        x: `${xOffset}%`,
                        scale,
                        zIndex,
                        opacity,
                        rotateY,
                        filter
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                      }}
                      style={{ originX: 0.5, originY: 0.5 }}
                    >
                      {/* Block interaction if not active card so you don't accidentally click buttons on blurred cards */}
                      <div className={`w-full h-full ${!isActive && 'pointer-events-none'}`}>
                        <CreatorCard creator={creator} />
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
            {/* Carousel Indicators */}
            <div className="flex gap-2 mt-8 z-20 relative">
              {CREATORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCreatorId(c.id)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${activeCreatorId === c.id ? 'bg-bmc-yellow scale-125 shadow-md' : 'bg-slate-300 hover:bg-slate-400'}`}
                  aria-label={`Go to ${c.name}`}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Donation Widget tied to active creator */}
          <div className="flex justify-start relative z-20">
            <div className="w-full max-w-md h-[550px]">
              <DonationWidget creatorName={activeCreator.name} />
            </div>
          </div>
          
        </div>

        {/* Ledger History tied to active creator */}
        <div className="mt-20 relative z-20">
          <PraiseBoardWidget creatorName={activeCreator.name} />
        </div>
      </section>

    </main>
  );
}
