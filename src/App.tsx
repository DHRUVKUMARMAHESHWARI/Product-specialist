import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { LearningMap } from './components/LearningMap';
import { ProductSenseAI } from './components/ProductSenseAI';
import { Simulator } from './components/Simulator';
import { KnowledgeHub } from './components/KnowledgeHub';
import { PracticeGround } from './components/PracticeGround';
import { ViewState, UserProfile } from './types';
import { fetchUser } from './services/api';
import { Loader } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await fetchUser();
        setUser(userData);
      } catch (e) {
        console.error("Failed to load user", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const renderView = () => {
    if (!user) return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <h2 className="text-2xl font-black uppercase text-red-500 mb-2">Connection Failed</h2>
          <p className="mb-4">Could not reach the backend.</p>
          <p className="text-sm bg-gray-200 p-2 font-mono rounded">Ensure `npm start` is running in /backend</p>
      </div>
    );

    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard user={user} onNavigate={setCurrentView} />;
      case ViewState.LEARNING_MAP:
        return <LearningMap />;
      case ViewState.KNOWLEDGE_HUB:
        return <KnowledgeHub />;
      case ViewState.AI_COMPANION:
        return <ProductSenseAI />;
      case ViewState.SCENARIO:
        return <Simulator />;
      case ViewState.PRACTICE:
        return <PracticeGround />;
      default:
        return <Dashboard user={user} onNavigate={setCurrentView} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6]">
        <div className="flex flex-col items-center">
           <Loader size={48} className="animate-spin mb-4 text-blue-600" />
           <h2 className="font-black text-xl uppercase tracking-widest">Booting System...</h2>
        </div>
      </div>
    );
  }

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView}>
      {renderView()}
    </Layout>
  );
};

export default App;