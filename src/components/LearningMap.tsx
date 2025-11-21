import React, { useEffect, useState } from 'react';
import { fetchModules } from '../services/api';
import { Module } from '../types';
import { MODULES as MOCK_MODULES } from '../constants';
import { Badge, Button } from './ui/BrutalistComponents';
import { Lock, CheckCircle, Compass, Target, Map, Mountain, Layout, Code, Briefcase, Flag } from 'lucide-react';

export const LearningMap: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getModules = async () => {
      try {
        const data = await fetchModules();
        // FALLBACK: If the backend returns fewer than 10 modules (indicates old seed data), 
        // use the frontend constants to ensure the user sees the new Tri-Track curriculum.
        if (data && data.length > 10) {
            setModules(data);
        } else {
            console.warn("Using frontend fallback data for Learning Map");
            setModules(MOCK_MODULES);
        }
      } catch (err) {
        console.error(err);
        setModules(MOCK_MODULES); // Fallback on error
      } finally {
        setLoading(false);
      }
    };
    getModules();
  }, []);

  // Configuration for the Galaxies
  const galaxies = [
    { id: 'Foundation', title: '1. The Explorer', sub: 'Zero Knowledge', icon: Compass, desc: 'The journey begins. Learn the language.', bg: 'bg-gray-100', border: 'border-gray-300' },
    { id: 'Core', title: '2. The Builder', sub: 'Execution & Tactics', icon: Target, desc: 'Day-to-day mastery. Shipping features.', bg: 'bg-blue-50', border: 'border-blue-200' },
    { id: 'Advanced', title: '3. The Strategist', sub: 'Growth & Vision', icon: Map, desc: 'Thinking quarters ahead. Growth loops.', bg: 'bg-purple-50', border: 'border-purple-200' },
    { id: 'Expert', title: '4. The Leader', sub: 'Scale & Influence', icon: Mountain, desc: 'Org design and executive presence.', bg: 'bg-red-50', border: 'border-red-200' }
  ];

  // Configuration for the Tracks
  const tracks = [
    { id: 'DISCOVERY', label: 'Discovery', icon: Layout, color: 'bg-pink-500', lightColor: 'bg-pink-50', borderColor: 'border-pink-500', textColor: 'text-pink-700' },
    { id: 'DELIVERY', label: 'Delivery', icon: Code, color: 'bg-cyan-500', lightColor: 'bg-cyan-50', borderColor: 'border-cyan-500', textColor: 'text-cyan-700' },
    { id: 'STRATEGY', label: 'Strategy', icon: Briefcase, color: 'bg-emerald-500', lightColor: 'bg-emerald-50', borderColor: 'border-emerald-500', textColor: 'text-emerald-700' },
  ];

  if (loading) return <div className="flex justify-center items-center min-h-[500px] font-black text-xl uppercase animate-pulse">Loading Universe Data...</div>;

  return (
    <div className="pb-32 animate-fade-in bg-[#f8f9fa] min-h-screen">
      
      {/* MAP HERO */}
      <div className="bg-[#121212] text-white pt-16 pb-24 px-4 relative overflow-hidden border-b-8 border-black">
          {/* Grid Background Pattern */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          
          <div className="max-w-6xl mx-auto text-center relative z-10">
             <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-1 uppercase font-black text-xs mb-6 tracking-widest shadow-[4px_4px_0px_0px_#fff]">
                <Flag size={14} /> Curriculum v2.0
             </div>
             <h2 className="text-5xl md:text-8xl font-black uppercase mb-6 leading-[0.9] tracking-tighter">
                Product<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-cyan-500 to-emerald-500">Universe</span>
             </h2>
             <p className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed">
                A multi-track skill tree designed to take you from <span className="text-white border-b-2 border-gray-600">Zero</span> to <span className="text-white border-b-2 border-gray-600">Hero</span>.
             </p>
          </div>
      </div>

      {/* LEGEND BAR (Sticky) */}
      <div className="sticky top-16 md:top-0 z-40 bg-white border-b-4 border-black shadow-md overflow-x-auto">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 min-w-[600px]">
              <div className="font-black uppercase text-sm mr-8 shrink-0">Skill Tracks:</div>
              <div className="flex-1 flex justify-around">
                {tracks.map(t => (
                    <div key={t.id} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${t.color} ring-2 ring-black`}></div>
                        <span className={`font-bold uppercase text-xs md:text-sm ${t.textColor}`}>{t.label}</span>
                    </div>
                ))}
              </div>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12">
        {/* Render Each Galaxy */}
        {galaxies.map((galaxy, gIndex) => {
          const galaxyModules = modules.filter(m => m.category === galaxy.id);
          if (galaxyModules.length === 0) return null;
          
          return (
            <div key={galaxy.id} className="relative mb-24">
              {/* Galaxy Header */}
              <div className="flex flex-col md:flex-row items-center md:items-end gap-4 mb-12 border-b-2 border-black pb-4">
                  <div className={`p-3 md:p-4 border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}>
                      <galaxy.icon size={32} className="text-black" />
                  </div>
                  <div className="text-center md:text-left">
                      <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">{galaxy.sub}</div>
                      <h3 className="text-4xl font-black uppercase leading-none">{galaxy.title}</h3>
                  </div>
                  <p className="hidden md:block ml-auto text-sm font-medium text-gray-500 max-w-xs text-right">{galaxy.desc}</p>
              </div>

              {/* 3-Track Grid Layout */}
              <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                  
                  {/* Connecting Lines (Background) - Desktop Only */}
                  <div className="hidden md:block absolute top-0 bottom-0 left-[16.66%] w-1 bg-pink-100 -z-10"></div>
                  <div className="hidden md:block absolute top-0 bottom-0 left-[50%] w-1 bg-cyan-100 -z-10"></div>
                  <div className="hidden md:block absolute top-0 bottom-0 right-[16.66%] w-1 bg-emerald-100 -z-10"></div>

                  {tracks.map((track) => {
                      const trackModules = galaxyModules.filter(m => (m.track || 'GENERAL') === track.id);
                      
                      return (
                          <div key={track.id} className="flex flex-col gap-6">
                              {/* Mobile Track Label */}
                              <div className={`md:hidden text-center py-2 font-black uppercase text-white text-sm ${track.color} border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                                  {track.label}
                              </div>

                              {trackModules.map((mod, idx) => (
                                  <div 
                                    key={mod.id} 
                                    className={`
                                        relative group transition-all duration-300
                                        bg-white border-2 border-black p-5
                                        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                                        hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] 
                                        hover:-translate-y-1 hover:-translate-x-1
                                        cursor-pointer
                                        ${mod.locked ? 'grayscale opacity-80' : ''}
                                    `}
                                  >
                                      {/* Metro Station Dot (Desktop) */}
                                      <div className={`hidden md:block absolute -left-[31px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-black z-20 ${mod.locked ? 'bg-white' : track.color} ${track.id === 'DELIVERY' ? '-left-[31px]' : track.id === 'STRATEGY' ? '-left-[31px]' : ''}`}></div>
                                      
                                      {/* Connection Line Stub (Desktop) */}
                                      <div className="hidden md:block absolute -left-[24px] top-1/2 h-0.5 w-6 bg-black z-10"></div>

                                      <div className="flex justify-between items-start mb-3">
                                          <Badge color={track.lightColor}>{track.label}</Badge>
                                          {mod.locked ? <Lock size={16} className="text-gray-300" /> : <CheckCircle size={20} className={track.textColor} />}
                                      </div>

                                      <h4 className="font-black text-lg leading-tight mb-2 uppercase">{mod.title}</h4>
                                      <p className="text-xs text-gray-600 font-medium leading-relaxed border-l-2 border-gray-200 pl-2 mb-3">{mod.description}</p>
                                      
                                      <div className="flex items-center justify-between text-[10px] font-bold uppercase text-gray-400">
                                          <span>{mod.duration}</span>
                                          <span className={`${!mod.locked ? track.textColor : ''}`}>{mod.locked ? 'LOCKED' : 'START'}</span>
                                      </div>

                                      {/* Progress Bar Bottom */}
                                      {!mod.locked && (
                                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
                                              <div className={`h-full w-1/3 ${track.color}`}></div>
                                          </div>
                                      )}
                                  </div>
                              ))}

                              {/* Empty State Placeholder */}
                              {trackModules.length === 0 && (
                                  <div className="hidden md:flex flex-1 items-center justify-center opacity-30 border-2 border-dashed border-gray-300 min-h-[100px]">
                                      <div className="text-xs font-bold uppercase text-gray-400 transform -rotate-12">No Modules</div>
                                  </div>
                              )}
                          </div>
                      );
                  })}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="text-center pt-10 pb-20 bg-white border-t-4 border-black">
          <h3 className="text-3xl font-black uppercase mb-4">End of Known Universe</h3>
          <Button variant="outline" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Return to Start</Button>
      </div>
    </div>
  );
};