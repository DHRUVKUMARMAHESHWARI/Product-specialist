import React from 'react';
import { MODULES } from '../constants';
import { Card, Badge } from './ui/BrutalistComponents';
import { Lock, CheckCircle, PlayCircle } from 'lucide-react';

export const LearningMap: React.FC = () => {
  // Group by category
  const categories = ['Foundation', 'Core', 'Advanced', 'Expert'];

  return (
    <div className="space-y-12 pb-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-4xl font-black uppercase mb-4">The Universe of Product</h2>
        <p className="text-lg text-gray-600">From first principles to strategic mastery. Follow the path or explore freely.</p>
      </div>

      <div className="relative">
        {/* Connecting Line (Vertical) */}
        <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-gray-200 -translate-x-1/2 z-0 hidden md:block"></div>

        {categories.map((cat, catIndex) => {
          const catModules = MODULES.filter(m => m.category === cat);
          if (catModules.length === 0) return null;

          return (
            <div key={cat} className="relative z-10 mb-16">
              <div className="flex justify-center mb-8">
                <div className="bg-black text-white font-black text-xl px-6 py-2 uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(255,255,255,1),6px_6px_0px_0px_rgba(0,0,0,1)]">
                  {cat} Galaxy
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4">
                {catModules.map((mod, idx) => (
                  <div 
                    key={mod.id} 
                    className={`transition-all duration-300 ${
                        idx % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12 md:col-start-2 md:row-start-1'
                    } ${mod.category === 'Core' && idx === 0 ? 'md:col-start-1' : ''}`} // Simple zigzag attempt logic
                    style={{ gridRow: Math.floor(idx/2) + 1 }} // Force grid rows if needed, though simplified for now
                  >
                     {/* Mobile Stacked View / Desktop Zigzag via basic grid classes */}
                    <div className={`relative group ${mod.locked ? 'opacity-70 grayscale' : 'opacity-100'}`}>
                        {/* Connector Dot */}
                        <div className={`hidden md:block absolute top-1/2 w-6 h-6 bg-white border-4 border-black rounded-full z-20
                            ${idx % 2 === 0 ? '-right-3 translate-x-1/2' : '-left-3 -translate-x-1/2'}
                            ${!mod.locked ? 'bg-green-400' : ''}
                        `}></div>

                        <div className={`bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer relative overflow-hidden`}>
                             {mod.locked && (
                                 <div className="absolute top-2 right-2">
                                     <Lock size={20} className="text-gray-400" />
                                 </div>
                             )}
                             {!mod.locked && (
                                 <div className="absolute top-2 right-2 text-green-500">
                                     <PlayCircle size={24} />
                                 </div>
                             )}
                             
                            <div className="text-xs font-bold uppercase text-gray-500 mb-1">{mod.duration}</div>
                            <h4 className="font-bold text-lg leading-tight mb-2">{mod.title}</h4>
                            <p className="text-sm text-gray-600 mb-3">{mod.description}</p>
                            <Badge color={mod.difficulty === 'BEGINNER' ? 'bg-blue-200' : 'bg-purple-200'}>{mod.difficulty}</Badge>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
