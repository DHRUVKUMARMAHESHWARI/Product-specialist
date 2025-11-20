
import React, { useState } from 'react';
import { Card, Button, Badge } from './ui/BrutalistComponents';
import { evaluatePracticeExercise, generateResearchHelp } from '../services/gemini';
import { Target, Zap, FileText, ArrowLeft, PenTool, Crosshair, Layers, Loader, Award, Microscope, FlaskConical, ShieldAlert, CheckCircle, BookOpen, ChevronDown, ChevronUp, Copy, MessageSquare, FileSearch, Play, ArrowDown } from 'lucide-react';

type DrillType = 'STORY' | 'METRIC' | 'PRD' | 'RESEARCH' | null;
type ResearchMode = 'DESIGN' | 'SCRIPTING' | 'SYNTHESIS';

export const PracticeGround: React.FC = () => {
  const [activeDrill, setActiveDrill] = useState<DrillType>(null);

  // States for Story Smith
  const [storyPersona, setStoryPersona] = useState('');
  const [storyAction, setStoryAction] = useState('');
  const [storyBenefit, setStoryBenefit] = useState('');

  // States for Metric Hunter
  const [metricScenario, setMetricScenario] = useState('');
  const [metricPrimary, setMetricPrimary] = useState('');
  const [metricCounter, setMetricCounter] = useState('');

  // States for PRD Architect
  const [prdMode, setPrdMode] = useState<'DRAFT' | 'TEST'>('DRAFT');
  const [prdSection, setPrdSection] = useState('Problem Statement');
  const [prdContent, setPrdContent] = useState('');
  const [prdTestPersona, setPrdTestPersona] = useState('Skeptical Lead Engineer');

  // States for Research Lab
  const [researchMode, setResearchMode] = useState<ResearchMode>('DESIGN');
  const [researchMystery, setResearchMystery] = useState('');
  const [researchInput, setResearchInput] = useState('');
  const [researchMethod, setResearchMethod] = useState('User Interview (Qual)');
  const [showResearchGuide, setShowResearchGuide] = useState(false);
  
  // New Research Lab States
  const [scriptScenario, setScriptScenario] = useState('');
  const [synthesisData, setSynthesisData] = useState('');
  const [generatedExamples, setGeneratedExamples] = useState<string>('');
  const [loadingGen, setLoadingGen] = useState(false);

  // Shared Evaluation State
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<{ score: number; feedback: string; tips: string[] } | null>(null);

  const reset = () => {
    setActiveDrill(null);
    setEvaluation(null);
    setIsEvaluating(false);
    setStoryPersona(''); setStoryAction(''); setStoryBenefit('');
    setMetricPrimary(''); setMetricCounter(''); setPrdContent('');
    setResearchInput('');
    setShowResearchGuide(false);
    setGeneratedExamples('');
    setScriptScenario('');
    setSynthesisData('');
  };

  const startMetricDrill = () => {
    const scenarios = [
      "Launching 'Dark Mode' for a banking app.",
      "Adding a 'Tip Driver' feature to a ride-sharing app.",
      "Creating a 'Watch Party' feature for a streaming service.",
      "Building a dashboard for enterprise warehouse managers."
    ];
    setMetricScenario(scenarios[Math.floor(Math.random() * scenarios.length)]);
    setActiveDrill('METRIC');
  };

  const startResearchDrill = () => {
    const mysteries = [
      "Users are signing up but dropping off immediately after the first login.",
      "Enterprise customers are complaining that the 'Reports' feature is 'unusable'.",
      "We want to build a 'Chat' feature but don't know if users actually want it.",
      "Two designs for the homepage are ready, but the team can't agree on which is better."
    ];
    setResearchMystery(mysteries[Math.floor(Math.random() * mysteries.length)]);
    setResearchMode('DESIGN');
    setActiveDrill('RESEARCH');
  }

  const generateResearchContent = async (type: 'EXAMPLES' | 'TRANSCRIPT' | 'SCENARIO') => {
      setLoadingGen(true);
      let context = "";
      if (type === 'EXAMPLES') context = researchMethod;
      if (type === 'TRANSCRIPT') context = "a user trying to book a flight but finding the filters confusing";
      if (type === 'SCENARIO') context = "User Research";

      const result = await generateResearchHelp(type, context);
      
      if (type === 'EXAMPLES') setGeneratedExamples(result);
      if (type === 'TRANSCRIPT') setSynthesisData(result);
      if (type === 'SCENARIO') setScriptScenario(result);
      
      setLoadingGen(false);
  };

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    let type: 'USER_STORY' | 'PRD_SECTION' | 'METRICS' | 'RESEARCH_PLAN' | 'PRD_ANALYSIS' | 'RESEARCH_SCRIPT' | 'RESEARCH_SYNTHESIS' = 'USER_STORY';
    let input = '';
    let context = '';

    if (activeDrill === 'STORY') {
      type = 'USER_STORY';
      input = `As a ${storyPersona}, I want to ${storyAction}, so that ${storyBenefit}.`;
    } else if (activeDrill === 'METRIC') {
      type = 'METRICS';
      input = `Primary Metric: ${metricPrimary}\nCounter Metric: ${metricCounter}`;
      context = metricScenario;
    } else if (activeDrill === 'PRD') {
      if (prdMode === 'DRAFT') {
          type = 'PRD_SECTION';
          input = prdContent;
          context = prdSection;
      } else {
          type = 'PRD_ANALYSIS';
          input = prdContent;
          context = prdTestPersona;
      }
    } else if (activeDrill === 'RESEARCH') {
      if (researchMode === 'DESIGN') {
          type = 'RESEARCH_PLAN';
          input = `Method: ${researchMethod}. Plan: ${researchInput}`;
          context = researchMystery;
      } else if (researchMode === 'SCRIPTING') {
          type = 'RESEARCH_SCRIPT';
          input = researchInput;
          context = scriptScenario;
      } else if (researchMode === 'SYNTHESIS') {
          type = 'RESEARCH_SYNTHESIS';
          input = researchInput;
          context = synthesisData;
      }
    }

    const result = await evaluatePracticeExercise(type, input, context);
    setEvaluation(result);
    setIsEvaluating(false);
  };

  const renderEvaluation = () => {
    if (!evaluation) return null;
    return (
      <div className="animate-slide-up mt-6 scroll-mt-20" id="eval-result">
        <Card className={`border-2 ${evaluation.score > 75 ? 'border-green-500 bg-green-50' : evaluation.score > 50 ? 'border-yellow-500 bg-yellow-50' : 'border-red-500 bg-red-50'}`}>
            <div className="flex items-center justify-between mb-4 border-b border-black/10 pb-4">
                <div>
                    <h4 className="font-black uppercase text-lg md:text-xl">Analysis Report</h4>
                    <div className="text-xs uppercase font-bold text-gray-500">AI Mentor Feedback</div>
                </div>
                <div className="flex items-center gap-2">
                    <Award size={24} className={`md:w-8 md:h-8 ${evaluation.score > 75 ? "text-green-600" : "text-gray-400"}`} />
                    <span className="text-3xl md:text-4xl font-black">{evaluation.score}</span>
                </div>
            </div>
            
            <div className="mb-4">
                <p className="font-medium text-base md:text-lg leading-relaxed whitespace-pre-wrap">{evaluation.feedback}</p>
            </div>

            <div className="bg-white border-2 border-black p-4">
                <h5 className="font-bold uppercase text-sm mb-2 flex items-center gap-2">
                    <Zap size={16} className="text-yellow-500" /> Actionable Tips
                </h5>
                <ul className="list-disc list-inside space-y-2 text-sm font-medium text-gray-700">
                    {evaluation.tips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                    ))}
                </ul>
            </div>
            
            <Button className="w-full mt-4" variant="outline" onClick={() => { setEvaluation(null); }}>Try Again / Refine</Button>
        </Card>
      </div>
    );
  };

  // --- MAIN MENU VIEW ---
  if (!activeDrill) {
    return (
      <div className="max-w-7xl mx-auto pb-20 animate-fade-in">
        <div className="mb-8 md:mb-12 text-center">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">Training Ground</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">Deliberate practice for product mastery. Choose a dojo to begin.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {/* CARD 1: User Stories */}
            <div onClick={() => setActiveDrill('STORY')} className="group cursor-pointer">
                <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-full p-6 md:p-8 hover:-translate-y-2 transition-transform flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <PenTool size={120} />
                    </div>
                    <div className="bg-blue-100 w-16 h-16 border-2 border-black flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors z-10 relative">
                        <PenTool size={32} />
                    </div>
                    <h3 className="text-2xl font-black uppercase mb-2 z-10 relative">Story Smith</h3>
                    <p className="text-gray-600 font-medium mb-6 flex-1 text-sm z-10 relative">
                        Master the "As a... I want to..." format. Create crystal clear tickets.
                    </p>
                    <div className="text-[10px] font-bold uppercase border-t-2 border-gray-100 pt-4 text-gray-400 z-10 relative">
                        Execution • Easy
                    </div>
                </div>
            </div>

            {/* CARD 2: Metrics */}
            <div onClick={startMetricDrill} className="group cursor-pointer">
                <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-full p-6 md:p-8 hover:-translate-y-2 transition-transform flex flex-col relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Crosshair size={120} />
                    </div>
                    <div className="bg-red-100 w-16 h-16 border-2 border-black flex items-center justify-center mb-6 group-hover:bg-red-500 group-hover:text-white transition-colors z-10 relative">
                        <Crosshair size={32} />
                    </div>
                    <h3 className="text-2xl font-black uppercase mb-2 z-10 relative">Metric Hunter</h3>
                    <p className="text-gray-600 font-medium mb-6 flex-1 text-sm z-10 relative">
                        Define North Star metrics and Counter-metrics for real scenarios.
                    </p>
                    <div className="text-[10px] font-bold uppercase border-t-2 border-gray-100 pt-4 text-gray-400 z-10 relative">
                        Analytics • Medium
                    </div>
                </div>
            </div>

            {/* CARD 3: Research */}
            <div onClick={startResearchDrill} className="group cursor-pointer">
                <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-full p-6 md:p-8 hover:-translate-y-2 transition-transform flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <FlaskConical size={120} />
                    </div>
                    <div className="bg-green-100 w-16 h-16 border-2 border-black flex items-center justify-center mb-6 group-hover:bg-green-500 group-hover:text-white transition-colors z-10 relative">
                        <FlaskConical size={32} />
                    </div>
                    <h3 className="text-2xl font-black uppercase mb-2 z-10 relative">Research Lab</h3>
                    <p className="text-gray-600 font-medium mb-6 flex-1 text-sm z-10 relative">
                        Design studies, script interviews, and synthesize insights from raw data.
                    </p>
                    <div className="text-[10px] font-bold uppercase border-t-2 border-gray-100 pt-4 text-gray-400 z-10 relative">
                        Discovery • Hard
                    </div>
                </div>
            </div>

            {/* CARD 4: PRD Architect */}
            <div onClick={() => setActiveDrill('PRD')} className="group cursor-pointer">
                <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-full p-6 md:p-8 hover:-translate-y-2 transition-transform flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Layers size={120} />
                    </div>
                    <div className="bg-purple-100 w-16 h-16 border-2 border-black flex items-center justify-center mb-6 group-hover:bg-purple-500 group-hover:text-white transition-colors z-10 relative">
                        <Layers size={32} />
                    </div>
                    <h3 className="text-2xl font-black uppercase mb-2 z-10 relative">PRD Studio</h3>
                    <p className="text-gray-600 font-medium mb-6 flex-1 text-sm z-10 relative">
                        Draft specs or run <span className="font-bold bg-red-100 px-1">Stress Tests</span> with AI personas.
                    </p>
                    <div className="text-[10px] font-bold uppercase border-t-2 border-gray-100 pt-4 text-gray-400 z-10 relative">
                        Strategy • Expert
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // --- ACTIVE DRILL VIEW ---
  return (
    <div className="max-w-5xl mx-auto pb-20 animate-fade-in">
        <Button variant="outline" onClick={reset} className="mb-4 md:mb-6 flex items-center gap-2">
            <ArrowLeft size={16} /> Exit Dojo
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            {/* Main Interactive Area */}
            <div className="order-2 md:order-1 md:col-span-7 space-y-6">
                <Card className="bg-white relative overflow-visible">
                    {/* HEADER */}
                    <div className="border-b-4 border-black pb-4 mb-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                            <h2 className="text-2xl md:text-3xl font-black uppercase leading-none">
                                {activeDrill === 'STORY' && "Story Smithing"}
                                {activeDrill === 'METRIC' && "Metric Hunting"}
                                {activeDrill === 'PRD' && "PRD Studio"}
                                {activeDrill === 'RESEARCH' && "The Research Lab"}
                            </h2>
                            {activeDrill === 'PRD' && (
                                <div className="flex gap-2 self-start md:self-auto">
                                    <button onClick={() => setPrdMode('DRAFT')} className={`px-3 py-1 text-xs font-bold uppercase border border-black transition-all ${prdMode === 'DRAFT' ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]' : 'bg-white hover:bg-gray-100'}`}>Draft Mode</button>
                                    <button onClick={() => setPrdMode('TEST')} className={`px-3 py-1 text-xs font-bold uppercase border border-black transition-all ${prdMode === 'TEST' ? 'bg-red-600 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]' : 'bg-white hover:bg-red-50 text-red-600'}`}>Stress Test</button>
                                </div>
                            )}
                            {activeDrill === 'RESEARCH' && (
                                <div className="flex gap-2 flex-wrap self-start md:self-auto">
                                    <button onClick={() => {setResearchMode('DESIGN'); setEvaluation(null);}} className={`px-2 py-1 text-[10px] font-bold uppercase border border-black transition-all ${researchMode === 'DESIGN' ? 'bg-black text-white' : 'bg-white'}`}>Design</button>
                                    <button onClick={() => {setResearchMode('SCRIPTING'); setEvaluation(null);}} className={`px-2 py-1 text-[10px] font-bold uppercase border border-black transition-all ${researchMode === 'SCRIPTING' ? 'bg-black text-white' : 'bg-white'}`}>Script</button>
                                    <button onClick={() => {setResearchMode('SYNTHESIS'); setEvaluation(null);}} className={`px-2 py-1 text-[10px] font-bold uppercase border border-black transition-all ${researchMode === 'SYNTHESIS' ? 'bg-black text-white' : 'bg-white'}`}>Synthesis</button>
                                </div>
                            )}
                        </div>
                        <p className="text-gray-600 font-bold mt-2 text-sm">
                            {activeDrill === 'STORY' && "Draft a user story that meets INVEST criteria."}
                            {activeDrill === 'METRIC' && "Define success for the scenario below."}
                            {activeDrill === 'PRD' && (prdMode === 'DRAFT' ? "Write a clear, unambiguous spec section." : "Simulate a review with an AI Stakeholder.")}
                            {activeDrill === 'RESEARCH' && (
                                researchMode === 'DESIGN' ? "Plan the study methodology for the mystery." :
                                researchMode === 'SCRIPTING' ? "Write unbiased questions to avoid leading the witness." :
                                "Extract the golden insight from the raw transcript."
                            )}
                        </p>
                    </div>

                    {/* CONTENT AREA */}
                    <div className="space-y-6">
                        {/* 1. USER STORY FORM */}
                        {activeDrill === 'STORY' && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                                    <h5 className="font-bold text-blue-900 text-sm uppercase mb-1">Structure Guide</h5>
                                    <p className="text-xs text-blue-800 font-medium">
                                        A User Story isn't just a task. It connects a <strong>User</strong> to a <strong>Feature</strong> for a specific <strong>Reason</strong>.
                                    </p>
                                </div>

                                <div className="relative">
                                    <label className="block text-xs font-bold uppercase mb-1 flex justify-between items-center">
                                        <span>1. The Who (Persona)</span>
                                        {storyPersona.length > 2 ? <span className="text-green-600 text-[10px] flex items-center animate-pulse-once"><CheckCircle size={12} className="mr-1"/> Ready</span> : <span className="text-gray-300 text-[10px]">Required</span>}
                                    </label>
                                    <input 
                                        className={`w-full border-2 p-3 md:p-4 font-medium focus:ring-4 focus:outline-none transition-all text-sm md:text-base ${storyPersona ? 'border-black bg-white' : 'border-gray-300 bg-gray-50'}`}
                                        placeholder="e.g. Frequent Business Traveler"
                                        value={storyPersona}
                                        onChange={(e) => setStoryPersona(e.target.value)}
                                    />
                                    <p className="text-[10px] text-gray-500 mt-1">Be specific. "User" is bad. "Power User" is better.</p>
                                </div>

                                <div className="relative">
                                    <div className="absolute -left-3 top-8 bottom-0 w-0.5 bg-gray-200 hidden md:block"></div>
                                    <label className="block text-xs font-bold uppercase mb-1 flex justify-between items-center">
                                        <span>2. The What (Action)</span>
                                        {storyAction.length > 2 ? <span className="text-green-600 text-[10px] flex items-center animate-pulse-once"><CheckCircle size={12} className="mr-1"/> Ready</span> : <span className="text-gray-300 text-[10px]">Required</span>}
                                    </label>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <span className="hidden md:block font-black text-gray-300 text-lg select-none md:w-24 md:text-right uppercase">I want to</span>
                                        <input 
                                            className={`w-full border-2 p-3 md:p-4 font-medium focus:ring-4 focus:outline-none transition-all text-sm md:text-base ${storyAction ? 'border-black bg-white' : 'border-gray-300 bg-gray-50'}`}
                                            placeholder="e.g. download my boarding pass"
                                            value={storyAction}
                                            onChange={(e) => setStoryAction(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <label className="block text-xs font-bold uppercase mb-1 flex justify-between items-center">
                                        <span>3. The Why (Benefit)</span>
                                        {storyBenefit.length > 2 ? <span className="text-green-600 text-[10px] flex items-center animate-pulse-once"><CheckCircle size={12} className="mr-1"/> Ready</span> : <span className="text-gray-300 text-[10px]">Required</span>}
                                    </label>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <span className="hidden md:block font-black text-gray-300 text-lg select-none md:w-24 md:text-right uppercase">So that</span>
                                        <input 
                                            className={`w-full border-2 p-3 md:p-4 font-medium focus:ring-4 focus:outline-none transition-all text-sm md:text-base ${storyBenefit ? 'border-black bg-white' : 'border-gray-300 bg-gray-50'}`}
                                            placeholder="e.g. I can access it offline at the gate"
                                            value={storyBenefit}
                                            onChange={(e) => setStoryBenefit(e.target.value)}
                                        />
                                    </div>
                                </div>
                                
                                <div className="bg-gray-900 text-white p-4 md:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] mt-6 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 text-gray-800 opacity-20 -mt-4 -mr-4">
                                        <PenTool size={100} />
                                    </div>
                                    <div className="flex justify-between items-start mb-3 relative z-10">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Preview Ticket</span>
                                        {storyPersona && storyAction && storyBenefit && (
                                            <button className="text-xs flex items-center gap-1 hover:text-blue-300 transition-colors" onClick={() => navigator.clipboard.writeText(`As a ${storyPersona}, I want to ${storyAction}, so that ${storyBenefit}.`)}>
                                                <Copy size={12} /> Copy
                                            </button>
                                        )}
                                    </div>
                                    <p className="font-serif text-lg md:text-2xl leading-relaxed relative z-10">
                                        "As a <span className="text-blue-300 border-b border-blue-300/30 transition-colors">{storyPersona || '_____'}</span>, 
                                        I want to <span className="text-green-300 border-b border-green-300/30 transition-colors">{storyAction || '_____'}</span>, 
                                        so that <span className="text-purple-300 border-b border-purple-300/30 transition-colors">{storyBenefit || '_____'}</span>."
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* 2. METRIC FORM */}
                        {activeDrill === 'METRIC' && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="bg-yellow-50 border-2 border-black p-4 mb-2 relative">
                                     <div className="absolute -top-3 -left-2 bg-black text-white px-2 py-1 text-[10px] font-bold uppercase transform -rotate-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
                                        Mission Context
                                    </div>
                                    <h5 className="font-bold text-lg mt-2">{metricScenario}</h5>
                                </div>

                                {/* Primary Metric Input */}
                                <div className="relative">
                                     <label className="block text-xs font-bold uppercase mb-2 flex items-center gap-2 text-green-700">
                                        <Target size={16} /> North Star Metric (Primary)
                                     </label>
                                     <div className="bg-green-50 p-3 border-l-4 border-green-500 mb-2 text-xs text-green-900 leading-snug">
                                        <strong>Guidance:</strong> What one number tells you the user is getting value? Don't choose a vanity metric like "Total Signups".
                                     </div>
                                     <input 
                                        className="w-full border-2 border-black p-4 font-bold focus:ring-4 focus:ring-green-200 focus:outline-none text-sm"
                                        placeholder="e.g. Time spent listening (Spotify) vs App Opens"
                                        value={metricPrimary}
                                        onChange={(e) => setMetricPrimary(e.target.value)}
                                     />
                                </div>

                                {/* Connecting Arrow */}
                                <div className="flex justify-center -my-2">
                                    <div className="bg-gray-100 p-1 rounded-full border border-gray-300 z-10">
                                        <ArrowDown size={16} className="text-gray-400" />
                                    </div>
                                </div>

                                {/* Counter Metric Input */}
                                <div className="relative">
                                     <label className="block text-xs font-bold uppercase mb-2 flex items-center gap-2 text-red-700">
                                        <ShieldAlert size={16} /> Counter Metric (The Check)
                                     </label>
                                     <div className="bg-red-50 p-3 border-l-4 border-red-500 mb-2 text-xs text-red-900 leading-snug">
                                        <strong>Guidance:</strong> If you optimize the North Star too hard, what breaks? What negative behavior are you guarding against?
                                     </div>
                                     <input 
                                        className="w-full border-2 border-black p-4 font-bold focus:ring-4 focus:ring-red-200 focus:outline-none text-sm"
                                        placeholder="e.g. Uninstalls, Latency, or Support Tickets"
                                        value={metricCounter}
                                        onChange={(e) => setMetricCounter(e.target.value)}
                                     />
                                </div>
                            </div>
                        )}

                        {/* 3. RESEARCH LAB FORM */}
                        {activeDrill === 'RESEARCH' && (
                            <div className="space-y-4">
                                {/* LAB NAV GUIDE */}
                                <div className="bg-black text-white p-4 mb-4">
                                     <h4 className="font-black uppercase text-lg flex items-center gap-2">
                                        <BookOpen size={20} /> Methodology & Tooling
                                     </h4>
                                     <div className="text-sm text-gray-300 mb-3">Understand the tools before you use them.</div>
                                     
                                     <button 
                                        onClick={() => setShowResearchGuide(!showResearchGuide)} 
                                        className="w-full bg-white text-black font-bold uppercase text-xs py-2 flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                                     >
                                        {showResearchGuide ? 'Close Guide' : 'Open Guide'}
                                        {showResearchGuide ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                                     </button>

                                     {showResearchGuide && (
                                         <div className="mt-4 space-y-4 animate-fade-in">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-gray-900 p-3 border border-gray-700">
                                                    <strong className="text-green-400 block mb-1 uppercase text-xs">Qualitative (The Why)</strong>
                                                    <p className="text-xs text-gray-300 leading-relaxed">Interviews, Field Studies. Use when you don't know what the problem is. Generates hypotheses.</p>
                                                </div>
                                                <div className="bg-gray-900 p-3 border border-gray-700">
                                                    <strong className="text-blue-400 block mb-1 uppercase text-xs">Quantitative (The What)</strong>
                                                    <p className="text-xs text-gray-300 leading-relaxed">Surveys, Analytics. Use when you need to measure scale or frequency. Validates hypotheses.</p>
                                                </div>
                                            </div>
                                            
                                            <div className="border-t border-gray-700 pt-4">
                                                <div className="flex justify-between items-center mb-2">
                                                    <strong className="text-yellow-300 text-xs uppercase">Example Questions Generator</strong>
                                                    <Button onClick={() => generateResearchContent('EXAMPLES')} disabled={loadingGen} className="py-1 px-2 text-[10px] h-auto">
                                                        {loadingGen ? <Loader size={10} className="animate-spin"/> : "Generate for Active Method"}
                                                    </Button>
                                                </div>
                                                {generatedExamples && (
                                                    <div className="bg-gray-800 p-3 text-xs text-gray-300 whitespace-pre-wrap font-mono border border-gray-600">
                                                        {generatedExamples}
                                                    </div>
                                                )}
                                                {!generatedExamples && <p className="text-[10px] text-gray-500 italic">Select a method in Design mode and click generate to see good vs bad examples.</p>}
                                            </div>
                                         </div>
                                     )}
                                </div>
                                
                                {/* --- MODE 1: STUDY DESIGN --- */}
                                {researchMode === 'DESIGN' && (
                                    <div className="animate-fade-in">
                                        <div className="bg-green-50 border-2 border-black p-4 mb-6">
                                            <div className="text-xs font-black uppercase text-green-800 mb-1">The Mystery</div>
                                            <p className="font-bold text-base md:text-lg">{researchMystery}</p>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-xs font-bold uppercase mb-1">Research Method</label>
                                            <select 
                                                className="w-full border-2 border-black p-3 font-bold bg-white text-sm"
                                                value={researchMethod}
                                                onChange={(e) => setResearchMethod(e.target.value)}
                                            >
                                                <option>User Interview (Qual)</option>
                                                <option>Survey (Quant)</option>
                                                <option>Data Analytics / Funnel Analysis (Quant)</option>
                                                <option>Usability Testing (Qual)</option>
                                                <option>A/B Testing (Quant)</option>
                                                <option>Card Sorting (Qual/Quant)</option>
                                                <option>Contextual Inquiry (Qual)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase mb-1">The Plan / Questions</label>
                                            <textarea 
                                                className="w-full border-2 border-black p-3 font-medium focus:ring-4 focus:ring-green-200 focus:outline-none h-40 resize-none text-sm"
                                                placeholder="What questions will you ask? Who will you target? What is your hypothesis?"
                                                value={researchInput}
                                                onChange={(e) => setResearchInput(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* --- MODE 2: SCRIPT DOCTOR --- */}
                                {researchMode === 'SCRIPTING' && (
                                    <div className="animate-fade-in">
                                        <div className="bg-blue-50 border-2 border-black p-4 mb-6 relative">
                                            <div className="text-xs font-black uppercase text-blue-800 mb-1">Context Scenario</div>
                                            {scriptScenario ? (
                                                <p className="font-bold text-base md:text-lg">{scriptScenario}</p>
                                            ) : (
                                                <div className="text-center py-4">
                                                    <p className="text-sm text-gray-500 mb-3">Generate a scenario to practice unbiased questioning.</p>
                                                    <Button onClick={() => generateResearchContent('SCENARIO')} disabled={loadingGen} variant="secondary">
                                                        {loadingGen ? <Loader size={16} className="animate-spin"/> : "Generate Scenario"}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase mb-1">Interview Script</label>
                                            <textarea 
                                                className="w-full border-2 border-black p-3 font-medium focus:ring-4 focus:ring-blue-200 focus:outline-none h-40 resize-none text-sm"
                                                placeholder="Write 3-5 non-leading questions..."
                                                value={researchInput}
                                                onChange={(e) => setResearchInput(e.target.value)}
                                                disabled={!scriptScenario}
                                            />
                                            <p className="text-[10px] text-gray-500 mt-2">Tip: Avoid 'Did you find it easy?'. Ask 'Walk me through how you did it'.</p>
                                        </div>
                                    </div>
                                )}

                                {/* --- MODE 3: INSIGHT MINER --- */}
                                {researchMode === 'SYNTHESIS' && (
                                    <div className="animate-fade-in">
                                        <div className="bg-yellow-50 border-2 border-black p-4 mb-6">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="text-xs font-black uppercase text-yellow-800">Raw User Transcript</div>
                                                <button onClick={() => generateResearchContent('TRANSCRIPT')} disabled={loadingGen} className="text-[10px] font-bold underline">
                                                    {loadingGen ? "Loading..." : "Load New Transcript"}
                                                </button>
                                            </div>
                                            {synthesisData ? (
                                                <div className="font-mono text-sm bg-white p-3 border border-yellow-200 max-h-40 overflow-y-auto">
                                                    {synthesisData}
                                                </div>
                                            ) : (
                                                <div className="text-center py-4">
                                                    <p className="text-sm text-gray-500 mb-3">Load data to practice synthesis.</p>
                                                    <Button onClick={() => generateResearchContent('TRANSCRIPT')} disabled={loadingGen} variant="secondary">
                                                        {loadingGen ? <Loader size={16} className="animate-spin"/> : "Load Data"}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase mb-1">Key Insight</label>
                                            <textarea 
                                                className="w-full border-2 border-black p-3 font-medium focus:ring-4 focus:ring-yellow-200 focus:outline-none h-32 resize-none text-sm"
                                                placeholder="What is the underlying motivation or pain point? Don't just summarize."
                                                value={researchInput}
                                                onChange={(e) => setResearchInput(e.target.value)}
                                                disabled={!synthesisData}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 4. PRD FORM (Dual Mode) */}
                        {activeDrill === 'PRD' && (
                            <div className="space-y-4">
                                {prdMode === 'DRAFT' ? (
                                    <>
                                    <div>
                                        <label className="block text-xs font-bold uppercase mb-1">Section Type</label>
                                        <select 
                                            className="w-full border-2 border-black p-3 font-bold bg-white text-sm"
                                            value={prdSection}
                                            onChange={(e) => setPrdSection(e.target.value)}
                                        >
                                            <option>Problem Statement</option>
                                            <option>Success Metrics</option>
                                            <option>Non-Functional Requirements</option>
                                            <option>Out of Scope</option>
                                            <option>Acceptance Criteria</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase mb-1">Draft Content</label>
                                        <textarea 
                                            className="w-full border-2 border-black p-3 font-medium focus:ring-4 focus:ring-purple-200 focus:outline-none h-48 resize-none font-mono text-sm"
                                            placeholder={`Draft your ${prdSection} here... Be specific.`}
                                            value={prdContent}
                                            onChange={(e) => setPrdContent(e.target.value)}
                                        />
                                    </div>
                                    </>
                                ) : (
                                    <div className="bg-red-50 border-2 border-red-200 p-4 shadow-[4px_4px_0px_0px_rgba(220,38,38,0.2)]">
                                        <div className="flex items-center gap-3 mb-4 text-red-900 border-b border-red-200 pb-4">
                                            <ShieldAlert size={24} />
                                            <div>
                                                <h4 className="font-black uppercase">Stress Test Lab</h4>
                                                <p className="text-xs">Simulate critical stakeholder feedback before you ship.</p>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-xs font-bold uppercase mb-1 text-red-900">Select Reviewer Persona</label>
                                            <select 
                                                className="w-full border-2 border-black p-3 font-bold bg-white text-sm"
                                                value={prdTestPersona}
                                                onChange={(e) => setPrdTestPersona(e.target.value)}
                                            >
                                                <option>Skeptical Lead Engineer (Checks feasibility)</option>
                                                <option>Confused UX Designer (Checks clarity)</option>
                                                <option>Impatient Stakeholder (Checks business value)</option>
                                                <option>QA Engineer (Checks edge cases & testing)</option>
                                                <option>Security Engineer (Checks vulnerabilities)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase mb-1 text-red-900">Paste Full PRD / Spec</label>
                                            <textarea 
                                                className="w-full border-2 border-black p-3 font-medium focus:ring-4 focus:ring-red-200 focus:outline-none h-48 resize-none font-mono text-sm"
                                                placeholder="Paste your requirements here to be stressed tested..."
                                                value={prdContent}
                                                onChange={(e) => setPrdContent(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <Button 
                            onClick={handleEvaluate} 
                            disabled={isEvaluating || (activeDrill === 'STORY' && (!storyPersona || !storyAction || !storyBenefit)) || (activeDrill === 'METRIC' && (!metricPrimary || !metricCounter)) || (activeDrill === 'PRD' && !prdContent) || (activeDrill === 'RESEARCH' && !researchInput)}
                            className={`w-full py-4 text-lg border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${activeDrill === 'PRD' && prdMode === 'TEST' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}`}
                        >
                            {isEvaluating ? (
                                <span className="flex items-center gap-2 justify-center"><Loader className="animate-spin" /> Analyzing...</span>
                            ) : (
                                activeDrill === 'PRD' && prdMode === 'TEST' ? <span className="flex items-center gap-2 justify-center"><ShieldAlert size={20} /> RUN STRESS TEST</span> : "Evaluate My Work"
                            )}
                        </Button>
                    </div>
                </Card>

                {renderEvaluation()}
            </div>

            {/* SIDEBAR TIPS - Stacked on mobile, sticky on desktop */}
            <div className="order-1 md:order-2 md:col-span-5 space-y-6">
                {activeDrill === 'STORY' && (
                    <Card title="The INVEST Framework" className="bg-blue-50 border-blue-900 md:sticky md:top-4">
                        <ul className="space-y-3">
                            <li className="flex gap-3"><div className="font-black bg-blue-200 w-6 h-6 flex items-center justify-center rounded-full text-xs border border-black shadow-sm shrink-0">I</div> <div className="text-sm"><strong>Independent:</strong> Can be released alone.</div></li>
                            <li className="flex gap-3"><div className="font-black bg-blue-200 w-6 h-6 flex items-center justify-center rounded-full text-xs border border-black shadow-sm shrink-0">N</div> <div className="text-sm"><strong>Negotiable:</strong> Open to discussion.</div></li>
                            <li className="flex gap-3"><div className="font-black bg-blue-200 w-6 h-6 flex items-center justify-center rounded-full text-xs border border-black shadow-sm shrink-0">V</div> <div className="text-sm"><strong>Valuable:</strong> Delivers value to user.</div></li>
                            <li className="flex gap-3"><div className="font-black bg-blue-200 w-6 h-6 flex items-center justify-center rounded-full text-xs border border-black shadow-sm shrink-0">E</div> <div className="text-sm"><strong>Estimable:</strong> Devs can size it.</div></li>
                            <li className="flex gap-3"><div className="font-black bg-blue-200 w-6 h-6 flex items-center justify-center rounded-full text-xs border border-black shadow-sm shrink-0">S</div> <div className="text-sm"><strong>Small:</strong> Fits in a sprint.</div></li>
                            <li className="flex gap-3"><div className="font-black bg-blue-200 w-6 h-6 flex items-center justify-center rounded-full text-xs border border-black shadow-sm shrink-0">T</div> <div className="text-sm"><strong>Testable:</strong> QA can verify it.</div></li>
                        </ul>
                    </Card>
                )}
                {activeDrill === 'METRIC' && (
                    <Card title="Metric Rules" className="bg-red-50 border-red-900 md:sticky md:top-4">
                        <div className="space-y-4 text-sm">
                            <div>
                                <strong className="block uppercase text-xs text-red-800 mb-1">North Star Metric</strong>
                                Captures the core value delivered to the customer. (e.g., "Time spent listening" vs "App opens")
                            </div>
                            <div>
                                <strong className="block uppercase text-xs text-red-800 mb-1">Counter Metric</strong>
                                What might go wrong if we optimize the NSM too hard? (e.g., "Uninstalls" or "Load Time")
                            </div>
                            <div className="bg-white p-3 border-2 border-black text-xs italic shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                                "Vanity metrics make you feel good, but you can't act on them." - Eric Ries
                            </div>
                        </div>
                    </Card>
                )}
                {activeDrill === 'PRD' && (
                    <Card title="PRD Best Practices" className="bg-purple-50 border-purple-900 md:sticky md:top-4">
                        <div className="space-y-4 text-sm">
                            <p>Engineers hate ambiguity. Be binary.</p>
                            <div className="bg-white p-3 border border-purple-200 opacity-60">
                                <div className="text-red-500 font-bold strike-through mb-1 text-xs uppercase">Bad Example</div>
                                "The system should be fast."
                            </div>
                            <div className="bg-white p-3 border-2 border-green-400">
                                <div className="text-green-600 font-bold mb-1 text-xs uppercase">Good Example</div>
                                "API response time must be under 200ms for 95% of requests."
                            </div>
                            {prdMode === 'TEST' && (
                                <div className="mt-4 border-t border-purple-200 pt-4">
                                    <strong className="text-purple-900 uppercase text-xs">Why Stress Test?</strong>
                                    <p className="mt-1 text-xs leading-relaxed">Running your PRD against the AI persona helps identify gaps before you present to real stakeholders. It hurts now so it won't hurt later.</p>
                                </div>
                            )}
                        </div>
                    </Card>
                )}
                {activeDrill === 'RESEARCH' && (
                    <Card title="Research Cheat Sheet" className="bg-green-50 border-green-900 md:sticky md:top-4">
                        <div className="space-y-4 text-sm">
                            <div>
                                <strong className="block uppercase text-xs text-green-800 mb-1">Qualitative</strong>
                                Interviews, Usability Tests. Good for open-ended discovery and feelings.
                            </div>
                            <div>
                                <strong className="block uppercase text-xs text-green-800 mb-1">Quantitative</strong>
                                Surveys, Analytics, A/B Tests. Good for validating scale and patterns.
                            </div>
                            <div className="bg-white p-3 border-2 border-black text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                                <strong>Bias Alert:</strong> Never ask "Would you use this?". Ask "When was the last time you tried to solve this problem?"
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    </div>
  );
};
