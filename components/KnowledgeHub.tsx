import React, { useState, useRef, useEffect } from 'react';
import { LEARNING_RESOURCES } from '../constants';
import { Card, Button, Badge } from './ui/BrutalistComponents';
import { Difficulty, LearningResource } from '../types';
import { BookOpen, Clock, Tag, ArrowLeft, Sparkles, Loader, Search, Zap, Brain, CheckSquare, FileText } from 'lucide-react';
import { generateLearningContent, generateContentIntel } from '../services/gemini';

export const KnowledgeHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Difficulty | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState<LearningResource | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Reader Interaction States
  const [intelLoading, setIntelLoading] = useState(false);
  const [intelResult, setIntelResult] = useState<{type: string, content: string} | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Filter logic
  const filteredResources = LEARNING_RESOURCES.filter(r => {
    const matchesTab = activeTab === 'ALL' || r.difficulty === activeTab;
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const handleOpenResource = async (resource: LearningResource) => {
    setSelectedResource(resource);
    setGeneratedContent(null);
    setIntelResult(null);
    window.scrollTo(0, 0);
  };

  const handleGenerateCustomGuide = async () => {
    if (!searchQuery) return;
    setIsLoading(true);
    
    // Create a temporary resource object for the custom topic
    const newResource: LearningResource = {
      id: `custom-${Date.now()}`,
      title: searchQuery,
      description: `Custom generated learning guide for "${searchQuery}"`,
      type: 'GUIDE',
      difficulty: Difficulty.INTERMEDIATE, // Default
      category: 'Custom',
      duration: '10 min',
      tags: ['AI Generated', 'Custom'],
    };

    const content = await generateLearningContent(searchQuery, "A custom user-requested topic for product management mastery.");
    
    setSelectedResource(newResource);
    setGeneratedContent(content);
    setIsLoading(false);
  };

  const handleGenerateExistingContent = async () => {
    if (!selectedResource) return;
    setIsLoading(true);
    const content = await generateLearningContent(selectedResource.title, selectedResource.description);
    setGeneratedContent(content);
    setIsLoading(false);
  };

  const handleIntelAction = async (type: 'TAKEAWAYS' | 'QUIZ' | 'ELI5') => {
    const textToAnalyze = generatedContent || selectedResource?.content;
    if (!textToAnalyze) return;

    setIntelLoading(true);
    const result = await generateContentIntel(textToAnalyze, type);
    setIntelResult({ type, content: result });
    setIntelLoading(false);
  };

  // Markdown renderer
  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h3 key={i} className="text-2xl font-black mt-8 mb-4 uppercase tracking-tight">{line.replace('## ', '')}</h3>;
      if (line.startsWith('# ')) return <h2 key={i} className="text-4xl font-black mt-10 mb-6 uppercase bg-yellow-300 inline-block px-2 transform -rotate-1">{line.replace('# ', '')}</h2>;
      if (line.startsWith('**')) return <p key={i} className="font-bold mb-2 text-lg">{line.replace(/\*\*/g, '')}</p>; 
      if (line.startsWith('- ')) return <li key={i} className="ml-6 mb-2 list-disc pl-2">{line.replace('- ', '')}</li>;
      if (line.match(/^\d\./)) return <li key={i} className="ml-6 mb-2 list-decimal pl-2 font-bold">{line.replace(/^\d\.\s/, '')}</li>;
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="mb-4 leading-relaxed text-gray-800 text-lg font-medium">{line.replace(/\*\*/g, '')}</p>;
    });
  };

  // --- READER VIEW ---
  if (selectedResource) {
    const displayContent = generatedContent || selectedResource.content;

    return (
      <div className="max-w-6xl mx-auto animate-fade-in pb-20">
        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-6 sticky top-20 md:top-4 z-30 bg-[#f3f4f6]/90 backdrop-blur-sm py-4 border-b-2 border-black/10">
             <Button variant="outline" onClick={() => setSelectedResource(null)} className="flex items-center gap-2 text-xs">
                <ArrowLeft size={14} /> RETURN TO BASE
            </Button>
            <div className="hidden md:flex gap-2">
                 <Badge color="bg-black text-white">READING MODE</Badge>
                 {isLoading && <Badge color="bg-yellow-300 text-black animate-pulse">GENERATING...</Badge>}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-8">
                <article className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative">
                    {/* Header */}
                    <header className="bg-black text-white p-8 md:p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <BookOpen size={120} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="bg-[#2563eb] text-white px-2 py-1 text-xs font-bold uppercase border border-white">{selectedResource.category}</span>
                                <span className="bg-transparent border border-white text-white px-2 py-1 text-xs font-bold uppercase">{selectedResource.duration}</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 leading-[0.9]">
                                {selectedResource.title}
                            </h1>
                            <p className="text-lg text-gray-300 font-medium max-w-2xl font-mono border-l-2 border-[#2563eb] pl-4">
                                {selectedResource.description}
                            </p>
                        </div>
                    </header>

                    {/* Content Body */}
                    <div className="p-8 md:p-12 bg-white min-h-[400px]" ref={contentRef}>
                        {displayContent ? (
                        <div className="prose prose-xl max-w-none font-sans">
                            {renderMarkdown(displayContent)}
                        </div>
                        ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 border-4 border-dashed border-gray-200 bg-gray-50 m-4 p-8">
                            <div className="bg-white p-4 rounded-full border-2 border-black shadow-md">
                                <Sparkles size={48} className="text-yellow-400" />
                            </div>
                            <div className="max-w-md">
                                <h3 className="text-2xl font-black uppercase mb-2">Initialize Knowledge Download</h3>
                                <p className="text-gray-600 mb-6 font-medium">This module needs to be compiled by the ProductSense Engine.</p>
                                <Button onClick={handleGenerateExistingContent} disabled={isLoading} className="w-full text-lg py-4">
                                    {isLoading ? (
                                    <span className="flex items-center justify-center gap-2"><Loader className="animate-spin" /> COMPILING DATA...</span>
                                    ) : (
                                    <span className="flex items-center justify-center gap-2"><Zap size={20} /> GENERATE GUIDE</span>
                                    )}
                                </Button>
                            </div>
                        </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-100 border-t-2 border-black p-6 flex justify-between items-center">
                        <div className="text-xs font-bold uppercase text-gray-500">End of File</div>
                        <Button variant="secondary" onClick={() => setSelectedResource(null)}>MARK COMPLETE (+50 XP)</Button>
                    </div>
                </article>
            </div>

            {/* Sidebar Tools */}
            <div className="lg:col-span-4 space-y-6">
                <Card title="Intel Extraction" className="sticky top-24 bg-[#fefce8]">
                    <p className="text-xs font-bold text-gray-500 mb-4 uppercase">Active Analysis Tools</p>
                    
                    <div className="grid grid-cols-1 gap-3 mb-6">
                        <button 
                            onClick={() => handleIntelAction('TAKEAWAYS')}
                            disabled={intelLoading || !displayContent}
                            className="flex items-center gap-3 p-3 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all hover:bg-blue-50 text-left group"
                        >
                            <FileText className="shrink-0 group-hover:text-blue-600" />
                            <div>
                                <div className="font-bold text-sm uppercase">Key Takeaways</div>
                                <div className="text-[10px] text-gray-500">Extract bullet points</div>
                            </div>
                        </button>

                        <button 
                            onClick={() => handleIntelAction('ELI5')}
                            disabled={intelLoading || !displayContent}
                            className="flex items-center gap-3 p-3 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all hover:bg-purple-50 text-left group"
                        >
                            <Brain className="shrink-0 group-hover:text-purple-600" />
                            <div>
                                <div className="font-bold text-sm uppercase">Simplify (ELI5)</div>
                                <div className="text-[10px] text-gray-500">Explain like I'm 5</div>
                            </div>
                        </button>

                        <button 
                            onClick={() => handleIntelAction('QUIZ')}
                            disabled={intelLoading || !displayContent}
                            className="flex items-center gap-3 p-3 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all hover:bg-green-50 text-left group"
                        >
                            <CheckSquare className="shrink-0 group-hover:text-green-600" />
                            <div>
                                <div className="font-bold text-sm uppercase">Test Knowledge</div>
                                <div className="text-[10px] text-gray-500">Generate Quiz</div>
                            </div>
                        </button>
                    </div>

                    {/* Analysis Output Area */}
                    <div className="min-h-[100px] border-t-2 border-black pt-4 border-dashed">
                         {intelLoading ? (
                             <div className="flex flex-col items-center justify-center py-4 text-gray-500 animate-pulse">
                                 <Loader className="animate-spin mb-2" />
                                 <span className="text-xs font-mono uppercase">Analyzing Text Stream...</span>
                             </div>
                         ) : intelResult ? (
                             <div className="animate-slide-up">
                                 <div className="flex justify-between items-center mb-2">
                                     <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase">{intelResult.type}</span>
                                     <button onClick={() => setIntelResult(null)} className="text-xs underline hover:text-red-500">Clear</button>
                                 </div>
                                 <div className="prose prose-sm font-medium bg-white p-3 border border-black text-sm max-h-[300px] overflow-y-auto">
                                     {renderMarkdown(intelResult.content)}
                                 </div>
                             </div>
                         ) : (
                             <div className="text-center text-gray-400 text-xs italic py-4">
                                 Select a tool above to analyze the content.
                             </div>
                         )}
                    </div>
                </Card>
            </div>
        </div>
      </div>
    );
  }

  // --- LIBRARY VIEW ---
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Hero */}
      <div className="bg-black text-white p-8 md:p-12 border-b-4 border-[#2563eb] shadow-[8px_8px_0px_0px_rgba(37,99,235,1)]">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">
                    Knowledge<br/>Protocol
                </h2>
                <p className="text-xl text-gray-300 max-w-lg border-l-2 border-white pl-4">
                    Access the central database of Product Management wisdom. 
                    <span className="text-[#2563eb] font-bold block mt-1">Prepare for everything.</span>
                </p>
            </div>
            <div className="hidden md:block">
                <BookOpen size={80} className="text-gray-800" />
            </div>
         </div>
      </div>

      {/* Search & Controls */}
      <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sticky top-4 z-20">
          <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search database or type a new topic to generate..." 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 focus:border-black focus:ring-0 font-bold text-lg transition-colors"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && filteredResources.length === 0 && searchQuery) {
                            handleGenerateCustomGuide();
                        }
                    }}
                  />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                 {['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'].map((tab) => (
                    <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-6 py-2 font-black uppercase text-sm border-2 border-black transition-all whitespace-nowrap flex items-center
                        ${activeTab === tab ? 'bg-[#2563eb] text-white' : 'bg-white hover:bg-gray-100'}
                    `}
                    >
                    {tab}
                    </button>
                ))}
              </div>
          </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {/* Dynamic Generation Card (Shows when no results or searching) */}
        {searchQuery && (
             <div onClick={handleGenerateCustomGuide} className="border-4 border-dashed border-black bg-yellow-50 p-6 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-yellow-100 transition-colors min-h-[300px] group">
                <div className="bg-black text-white p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    {isLoading ? <Loader className="animate-spin" /> : <Sparkles size={32} />}
                </div>
                <h3 className="text-2xl font-black uppercase mb-2">Generate "{searchQuery}"</h3>
                <p className="text-sm font-bold text-gray-600 px-8">
                    Topic not found in local database. Click to initialize AI generation sequence.
                </p>
             </div>
        )}

        {filteredResources.map((resource) => (
          <Card key={resource.id} className="flex flex-col h-full hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all cursor-pointer group bg-white" onClick={() => handleOpenResource(resource)}>
            <div className="flex justify-between items-start mb-6">
              <Badge color={
                resource.difficulty === Difficulty.BEGINNER ? 'bg-green-300' : 
                resource.difficulty === Difficulty.INTERMEDIATE ? 'bg-yellow-300' : 
                'bg-red-300'
              }>
                {resource.difficulty}
              </Badge>
              <div className="w-8 h-8 border-2 border-black flex items-center justify-center bg-gray-50 group-hover:bg-black group-hover:text-white transition-colors">
                  <BookOpen size={16} />
              </div>
            </div>
            
            <h3 className="text-2xl font-black uppercase mb-3 leading-tight flex-1 group-hover:text-[#2563eb] transition-colors">
              {resource.title}
            </h3>
            
            <p className="text-base text-gray-600 mb-6 font-medium line-clamp-3 border-l-2 border-gray-200 pl-3">
              {resource.description}
            </p>

            <div className="mt-auto pt-4 border-t-2 border-gray-100 flex justify-between items-center text-xs font-bold uppercase text-gray-400 group-hover:text-black">
              <span className="flex items-center gap-1"><Clock size={14} /> {resource.duration}</span>
              <span className="flex items-center gap-1"><Tag size={14} /> {resource.category}</span>
            </div>
          </Card>
        ))}

        {filteredResources.length === 0 && !searchQuery && (
            <div className="col-span-full text-center py-20 opacity-50">
                <h3 className="text-2xl font-black uppercase">No Archives Found</h3>
                <p>Adjust filters to locate data.</p>
            </div>
        )}
      </div>
    </div>
  );
};