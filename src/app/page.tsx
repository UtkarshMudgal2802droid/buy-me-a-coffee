"use client";

import React, { useState, useRef, useEffect } from 'react';
import Hero from '@/components/Hero';
import CreatorCard from '@/components/CreatorCard';
import DonationWidget from '@/components/DonationWidget';
import PraiseBoardWidget from '@/components/PraiseBoardWidget';
import Navbar from '@/components/Navbar';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';

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

  const activeCreator = CREATORS[activeCreatorId];

  return (
    <main className="w-full min-h-screen relative overflow-hidden bg-transparent">
      <Navbar />
      
      {/* Section 1: Hero */}
      <section id="home" className="w-full min-h-screen flex items-center justify-center pt-32 pb-20 px-6 relative z-10">
        <Hero />
      </section>

      {/* Section 2: Creator Carousel & Donation Side-by-Side */}
      <section id="demo" className="scroll-mt-32 w-full min-h-screen flex flex-col justify-center py-20 px-6 relative z-10">
        
        <div className="text-center mb-12 pt-10">
          <h2 className="text-4xl font-black text-bmc-dark font-serif italic">Discover Creators</h2>
          <p className="text-slate-600 mt-2 font-medium">Swipe to explore. Fund their goals directly.</p>
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch perspective-1000">
          
          {/* Left Column: Advanced Swiper Coverflow Carousel */}
          <div className="flex flex-col items-center justify-center w-full max-w-[600px] mx-auto min-h-[600px] relative">
            
            {/* Custom Navigation Buttons */}
            <button 
              className={`swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-bmc-yellow rounded-full flex items-center justify-center border-2 border-bmc-dark shadow-[4px_4px_0px_0px_rgba(34,34,34,1)] transition-all ${activeCreatorId === 0 ? 'opacity-30 pointer-events-none' : 'hover:bg-yellow-400 hover:translate-x-[-2px] hover:translate-y-[-2px]'}`}
            >
              <ChevronLeft className="w-6 h-6 text-bmc-dark" strokeWidth={3} />
            </button>

            <button 
              className={`swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-bmc-yellow rounded-full flex items-center justify-center border-2 border-bmc-dark shadow-[4px_4px_0px_0px_rgba(34,34,34,1)] transition-all ${activeCreatorId === CREATORS.length - 1 ? 'opacity-30 pointer-events-none' : 'hover:bg-yellow-400 hover:translate-x-[2px] hover:translate-y-[-2px]'}`}
            >
              <ChevronRight className="w-6 h-6 text-bmc-dark" strokeWidth={3} />
            </button>

            <Swiper
              effect={'coverflow'}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={'auto'}
              navigation={{
                prevEl: '.swiper-button-prev-custom',
                nextEl: '.swiper-button-next-custom',
              }}
              coverflowEffect={{
                rotate: 30,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: false,
              }}
              modules={[EffectCoverflow, Navigation]}
              onSlideChange={(swiper) => setActiveCreatorId(swiper.activeIndex)}
              className="w-full px-12"
            >
              {CREATORS.map((creator, index) => (
                <SwiperSlide key={creator.id} className="w-[400px] py-10 px-4">
                  <div className={`transition-all duration-300 ${activeCreatorId !== index ? 'opacity-50 blur-[2px] pointer-events-none' : 'opacity-100'}`}>
                    <CreatorCard creator={creator} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Right Column: Donation Widget tied to active creator */}
          <div className="flex justify-start relative z-20">
            <div className="w-full max-w-md min-h-[600px]">
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
