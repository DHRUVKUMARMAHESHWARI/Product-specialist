import React from 'react';
import { NAV_ITEMS } from '../constants';
import { ViewState } from '../types';
import { LogOut, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setCurrentView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-black flex font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 bg-[#1a1a1a] text-white flex-col fixed h-full z-50 border-r-4 border-black">
        <div className="p-6 border-b-2 border-gray-800">
          <h1 className="text-2xl font-black tracking-tighter uppercase text-white">
            Prod<span className="text-[#2563eb]">Mastery</span>
          </h1>
          <p className="text-xs text-gray-500 font-mono mt-1">v1.0.0 BETA</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as ViewState)}
                className={`w-full flex items-center gap-3 px-4 py-3 font-bold uppercase text-sm transition-all
                  ${isActive 
                    ? 'bg-[#2563eb] text-white shadow-[4px_4px_0px_0px_#fff] translate-x-1' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t-2 border-gray-800">
          <button className="flex items-center gap-2 text-gray-500 hover:text-white font-bold uppercase text-xs transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#1a1a1a] text-white z-[60] p-4 border-b-2 border-black flex justify-between items-center shadow-md h-16">
         <h1 className="text-xl font-black tracking-tighter uppercase">Prod<span className="text-[#2563eb]">Mastery</span></h1>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-1">
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
         </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-[#1a1a1a] z-[55] pt-20 p-6 md:hidden animate-fade-in">
           <nav className="space-y-4">
            {NAV_ITEMS.map((item) => {
               const Icon = item.icon;
               return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id as ViewState);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-4 text-white text-xl font-bold uppercase py-4 border-b border-gray-800 hover:text-[#2563eb] transition-colors"
                >
                  <Icon size={24} />
                  {item.label}
                </button>
               );
            })}
           </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 min-h-screen w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};