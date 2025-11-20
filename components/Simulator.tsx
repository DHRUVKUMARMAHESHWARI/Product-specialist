import React, { useState } from 'react';
import { SCENARIOS } from '../constants';
import { Card, Button, Badge } from './ui/BrutalistComponents';
import { evaluateScenarioSubmission } from '../services/gemini';
import { Play, AlertCircle, CheckCircle, Loader } from 'lucide-react';

export const Simulator: React.FC = () => {
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [submission, setSubmission] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const scenario = SCENARIOS.find(s => s.id === activeScenarioId);

  const handleSubmit = async () => {
    if (!scenario || !submission) return;
    setIsSubmitting(true);
    const evalResult = await evaluateScenarioSubmission(
      `Context: ${scenario.context}. Task: ${scenario.task}`,
      submission
    );
    setResult(evalResult);
    setIsSubmitting(false);
  };

  const reset = () => {
    setActiveScenarioId(null);
    setSubmission('');
    setResult(null);
  };

  if (!activeScenarioId) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 mb-4">
            <h2 className="text-3xl font-black uppercase mb-2">Real-World Simulator</h2>
            <p className="text-lg text-gray-600">Practice high-stakes situations safely.</p>
        </div>
        {SCENARIOS.map((s) => (
          <Card key={s.id} className="hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <Badge color={s.difficulty === 'BEGINNER' ? 'bg-green-300' : s.difficulty === 'INTERMEDIATE' ? 'bg-yellow-300' : 'bg-red-300'}>
                {s.difficulty}
              </Badge>
              <Play className="group-hover:text-[#2563eb]" />
            </div>
            <h3 className="text-xl font-black mb-2 uppercase">{s.title}</h3>
            <p className="text-sm text-gray-600 mb-4 min-h-[3rem]">{s.description}</p>
            <Button className="w-full" variant="outline" onClick={() => setActiveScenarioId(s.id)}>Start Simulation</Button>
          </Card>
        ))}
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="outline" onClick={reset} className="mb-4">← Back to Scenarios</Button>
        
        <Card title="Evaluation Report" className="border-black">
            <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 border-2 border-black">
                <div className="text-5xl font-black text-[#2563eb]">{result.score}/100</div>
                <div>
                    <div className="font-bold uppercase text-sm text-gray-500">Performance Score</div>
                    <div className="font-bold">
                        {result.score > 80 ? "Outstanding!" : result.score > 60 ? "Good Job" : "Needs Improvement"}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <h4 className="font-black uppercase mb-2 flex items-center gap-2">
                        <AlertCircle size={20} /> Feedback
                    </h4>
                    <p className="text-gray-800 leading-relaxed border-l-4 border-blue-500 pl-4">{result.feedback}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 p-4 border-2 border-green-200">
                        <h5 className="font-bold text-green-800 mb-2 uppercase text-sm">Strengths</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            {result.strengths?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                        </ul>
                    </div>
                    <div className="bg-red-50 p-4 border-2 border-red-200">
                        <h5 className="font-bold text-red-800 mb-2 uppercase text-sm">Improvements</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            {result.improvements?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <Button variant="outline" onClick={() => setActiveScenarioId(null)} className="self-start mb-4">← Cancel</Button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        <div className="lg:col-span-1 space-y-6">
            <Card title="Mission Briefing" className="bg-gray-50">
                <div className="mb-4">
                    <div className="text-xs font-bold uppercase text-gray-500 mb-1">Context</div>
                    <p className="font-medium">{scenario?.context}</p>
                </div>
                <div>
                    <div className="text-xs font-bold uppercase text-gray-500 mb-1">Your Task</div>
                    <p className="font-medium bg-yellow-100 p-2 border border-black">{scenario?.task}</p>
                </div>
            </Card>
            <Card className="bg-blue-50 border-blue-900">
                <h4 className="font-bold text-blue-900 mb-2 text-sm uppercase">Pro Tip</h4>
                <p className="text-xs text-blue-800">Remember to empathize first, then use data to back up your decision. Don't just say "No".</p>
            </Card>
        </div>
        
        <div className="lg:col-span-2 flex flex-col h-full">
            <Card className="flex-1 flex flex-col" title="Your Response">
                <textarea 
                    className="flex-1 w-full p-4 border-2 border-gray-300 focus:border-black focus:ring-0 resize-none font-mono text-sm mb-4"
                    placeholder="Type your response here..."
                    value={submission}
                    onChange={(e) => setSubmission(e.target.value)}
                />
                <div className="flex justify-end">
                    <Button 
                        onClick={handleSubmit} 
                        disabled={isSubmitting || !submission}
                        className="w-full md:w-auto"
                    >
                        {isSubmitting ? <><Loader className="animate-spin inline mr-2" /> Analyzing...</> : "Submit Response"}
                    </Button>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};
