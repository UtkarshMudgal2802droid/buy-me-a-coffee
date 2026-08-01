import React from 'react';
import CreatorCard from '@/components/CreatorCard';
import DonationWidget from '@/components/DonationWidget';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CreatorPage() {
  return (
    <main className="min-h-screen py-12 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* Navigation */}
      <nav className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </nav>

      {/* Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 relative">
        
        {/* Left Column: Creator Profile (Takes up 7 cols on large screens) */}
        <div className="lg:col-span-7 space-y-8">
          <CreatorCard />
          
          <div className="glass-card p-8 border border-white/10">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="text-warm-amber">🔥</span> Latest Updates
            </h2>
            <div className="space-y-6">
              {[
                { date: '2 hours ago', title: 'Carolina Reaper Drying - Day 14', content: 'The wrinkles are really starting to set in. The color has shifted from a bright vermillion to a deep, dangerous crimson. 4K render dropping tonight for members!' },
                { date: '3 days ago', title: 'New Camera Rig Setup', content: 'Just got the new Laowa 24mm Probe Lens. The perspective it gives on these tiny biological structures is absolutely mind-blowing. Can’t wait to show you the test footage.' }
              ].map((update, i) => (
                <div key={i} className="pb-6 border-b border-white/5 last:border-0 last:pb-0">
                  <div className="text-xs text-electric-purple font-bold tracking-wider mb-2 uppercase">{update.date}</div>
                  <h3 className="text-lg font-bold mb-2">{update.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{update.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Donation Widget (Sticky, takes 5 cols) */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-8">
            <DonationWidget />
          </div>
        </div>

      </div>
    </main>
  );
}
