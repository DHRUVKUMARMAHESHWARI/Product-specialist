import React from 'react';
import { Card, Button, ProgressBar, Badge } from './ui/BrutalistComponents';
import { UserProfile } from '../types';
import { Flame, TrendingUp, Trophy, Brain, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const data = [
  { name: 'Mon', xp: 400 },
  { name: 'Tue', xp: 300 },
  { name: 'Wed', xp: 600 },
  { name: 'Thu', xp: 200 },
  { name: 'Fri', xp: 800 },
  { name: 'Sat', xp: 500 },
  { name: 'Sun', xp: 900 },
];

interface DashboardProps {
  user: UserProfile;
  onNavigate: (view: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const skillData = [
    { name: 'Research', val: user.confidence.research },
    { name: 'Strat', val: user.confidence.strategy },
    { name: 'Tech', val: user.confidence.technical },
    { name: 'Comm', val: user.confidence.communication },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2 bg-[#fefce8]">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl md:text-4xl font-black uppercase mb-2 leading-tight">Welcome back, {user.name}</h1>
              <p className="text-base md:text-lg text-gray-700 font-medium">Today's focus: <span className="bg-yellow-300 px-1 border border-black">User Interviews</span></p>
            </div>
            <div className="hidden md:block text-5xl">🚀</div>
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm font-bold mb-2">
              <span>XP Progress to Level 3</span>
              <span>{user.xp} / 2000 XP</span>
            </div>
            <ProgressBar value={user.xp} max={2000} color="bg-[#a3e635]" />
          </div>
        </Card>

        <Card className="bg-[#ffe4e6] flex flex-col items-center justify-center text-center">
          <div className="text-4xl mb-2">🔥</div>
          <div className="text-3xl font-black">{user.streak} DAYS</div>
          <div className="text-sm font-bold uppercase tracking-widest">Current Streak</div>
          <p className="text-xs mt-2 text-gray-600">Keep it up to earn the "Firestarter" badge!</p>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="border-2 border-black bg-white p-3 md:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-transform">
          <Trophy className="w-6 h-6 md:w-8 md:h-8 mb-2 text-yellow-500" />
          <div className="text-xl md:text-2xl font-bold">{user.completedModules.length}</div>
          <div className="text-[10px] md:text-xs uppercase font-bold text-gray-500">Modules Mastered</div>
        </div>
        <div className="border-2 border-black bg-white p-3 md:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-transform">
          <Brain className="w-6 h-6 md:w-8 md:h-8 mb-2 text-purple-500" />
          <div className="text-xl md:text-2xl font-bold">84%</div>
          <div className="text-[10px] md:text-xs uppercase font-bold text-gray-500">Retention Rate</div>
        </div>
        <div className="border-2 border-black bg-white p-3 md:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-transform">
          <TrendingUp className="w-6 h-6 md:w-8 md:h-8 mb-2 text-green-500" />
          <div className="text-xl md:text-2xl font-bold">Top 10%</div>
          <div className="text-[10px] md:text-xs uppercase font-bold text-gray-500">Among Beginners</div>
        </div>
        <div className="border-2 border-black bg-white p-3 md:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-transform cursor-pointer" onClick={() => onNavigate('AI_COMPANION')}>
          <div className="flex justify-between">
            <Brain className="w-6 h-6 md:w-8 md:h-8 mb-2 text-blue-500" />
            <ArrowRight className="w-4 h-4" />
          </div>
          <div className="text-base md:text-lg font-bold leading-tight mt-1">Ask ProductSense</div>
          <div className="text-[10px] md:text-xs uppercase font-bold text-gray-500">AI Mentor Ready</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <Card title="Weekly Activity" className="col-span-1 lg:col-span-2 h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="name" stroke="#000" tick={{fill: '#000', fontSize: 10, fontWeight: 'bold'}} />
              <YAxis stroke="#000" tick={{fill: '#000', fontSize: 10, fontWeight: 'bold'}} width={30} />
              <Tooltip 
                contentStyle={{ border: '2px solid black', boxShadow: '4px 4px 0px 0px black', borderRadius: '0px' }}
                itemStyle={{ fontWeight: 'bold', color: 'black' }}
              />
              <Line type="monotone" dataKey="xp" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: 'white', stroke: '#000' }} activeDot={{ r: 6, strokeWidth: 2, stroke: '#000' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Daily Mission */}
        <Card title="Today's Mission" className="bg-[#ecfccb]">
          <div className="space-y-4">
            <div className="bg-white border-2 border-black p-4 relative">
              <Badge color="bg-orange-400">Important</Badge>
              <h4 className="font-bold text-lg mt-2">Master the "5 Whys"</h4>
              <p className="text-sm text-gray-600 mt-1">Complete the Root Cause Analysis simulator scenario.</p>
              <Button className="w-full mt-4" variant="primary" onClick={() => onNavigate('SCENARIO')}>Start Mission</Button>
            </div>
            
            <div className="bg-white border-2 border-black p-4 opacity-50">
              <h4 className="font-bold text-lg">Review Flashcards</h4>
              <p className="text-sm text-gray-600">Coming up next.</p>
            </div>
          </div>
        </Card>
      </div>

       {/* Skill Matrix */}
       <Card title="Skill Competency Matrix">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillData} layout="vertical">
                 <XAxis type="number" hide />
                 <YAxis dataKey="name" type="category" width={80} tick={{fill: '#000', fontWeight: 'bold', fontSize: 12}} />
                 <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ border: '2px solid black' }} />
                 <Bar dataKey="val" fill="#000" barSize={20} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
       </Card>
    </div>
  );
};