import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { LearningMap } from './components/LearningMap';
import { ProductSenseAI } from './components/ProductSenseAI';
import { Simulator } from './components/Simulator';
import { KnowledgeHub } from './components/KnowledgeHub';
import { PracticeGround } from './components/PracticeGround';
import { ViewState, UserProfile } from './types';
import { MOCK_USER } from './constants';
import { Card, Button } from './components/ui/BrutalistComponents';
import { Target, Code } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [user] = useState<UserProfile>(MOCK_USER);

  const renderView = () => {
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

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView}>
      {renderView()}
    </Layout>
  );
};

export default App;