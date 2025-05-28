import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Lightbulb, Save, Code, Sparkles, AlertCircle, Copy } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { generateIdea, generateCodingPrompt } from "@/lib/gemini";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useUserSubscription } from "@/hooks/useUserSubscription";
import { saveIdea } from "@/lib/supabase";
const niches = [{
  id: 'IT',
  name: 'IT',
  color: 'bg-blue-600'
}, {
  id: 'Finance',
  name: 'Finance',
  color: 'bg-green-600'
}, {
  id: 'Productivity',
  name: 'Productivity',
  color: 'bg-purple-600'
}, {
  id: 'Crypto',
  name: 'Crypto',
  color: 'bg-orange-600'
}, {
  id: 'Healthcare',
  name: 'Healthcare',
  color: 'bg-red-600'
}, {
  id: 'Business',
  name: 'Business',
  color: 'bg-indigo-600'
}, {
  id: 'Others',
  name: 'Others',
  color: 'bg-gray-600'
}];
interface GeneratedIdea {
  businessName: string;
  description: string;
  niche: string;
  hashtags: string[];
  codingPrompt?: string;
}
const Dashboard = () => {
  const [selectedNiche, setSelectedNiche] = useState<string>('');
  const [hashtags, setHashtags] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [ideaCount, setIdeaCount] = useState<number[]>([1]);
  const [currentIdea, setCurrentIdea] = useState<GeneratedIdea | null>(null);
  const [showCodingPrompt, setShowCodingPrompt] = useState(false);
  const subscription = useUserSubscription();
  const queryClient = useQueryClient();
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };
  const generateIdeaMutation = useMutation({
    mutationFn: async () => {
      if (!selectedNiche) {
        throw new Error('Please select a niche first');
      }
      const requestedCount = ideaCount[0];
      if (requestedCount > subscription.maxIdeasPerGeneration) {
        throw new Error(`Free users can only generate up to ${subscription.maxIdeasPerGeneration} ideas at once. Please upgrade to Pro for more.`);
      }
      const hashtagArray = hashtags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      return await generateIdea(selectedNiche, hashtagArray, customPrompt);
    },
    onSuccess: idea => {
      setCurrentIdea(idea);
      toast.success('New idea generated successfully!');
    },
    onError: error => {
      toast.error(error.message || 'Failed to generate idea');
    }
  });
  const generatePromptMutation = useMutation({
    mutationFn: async () => {
      if (!subscription.canGenerateCodingPrompts) {
        throw new Error('Coding prompts are only available for Pro users. Please upgrade to continue.');
      }
      if (!currentIdea) throw new Error('No idea selected');
      return await generateCodingPrompt(currentIdea);
    },
    onSuccess: codingPrompt => {
      setCurrentIdea(prev => prev ? {
        ...prev,
        codingPrompt
      } : null);
      setShowCodingPrompt(true);
      toast.success('Coding prompt generated!');
    },
    onError: error => {
      toast.error(error.message || 'Failed to generate coding prompt');
    }
  });
  const saveIdeaMutation = useMutation({
    mutationFn: async () => {
      if (!currentIdea) throw new Error('No idea to save');
      return await saveIdea(currentIdea);
    },
    onSuccess: () => {
      toast.success('Idea saved successfully!');
      queryClient.invalidateQueries({
        queryKey: ['saved-ideas']
      });
    },
    onError: error => {
      toast.error(error.message || 'Failed to save idea');
    }
  });
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-blue-100 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Lightbulb className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-blue-900 dark:text-white">IdeaSpark</h1>
        </div>
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link to="/dashboard" className="text-blue-600 font-medium">
            Generate Ideas
          </Link>
          <Link to="/saved-ideas" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">
            Saved Ideas
          </Link>
          <Link to="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">
            Pricing
          </Link>
          
          <ThemeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-900 dark:text-white mb-4">Generate Your Next SaaS Idea</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">Select a niche, add hashtags, and let AI create unique business opportunities for you.</p>
        </div>

        {/* Niche Selection */}
        <Card className="mb-8 animate-fade-in dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 dark:text-white">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <span>Select Your Niche</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {niches.map(niche => <Button key={niche.id} variant={selectedNiche === niche.id ? "default" : "outline"} className={`h-12 ${selectedNiche === niche.id ? `${niche.color} text-white hover:opacity-90` : 'border-blue-200 dark:border-gray-600 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700'}`} onClick={() => setSelectedNiche(niche.id)}>
                  {niche.name}
                </Button>)}
            </div>
          </CardContent>
        </Card>

        {/* Custom Prompt Input */}
        <Card className="mb-8 animate-fade-in dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Custom Prompt (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Textarea placeholder="Add specific requirements or details for your SaaS idea (e.g., 'focus on small businesses', 'mobile-first approach', 'AI-powered features')" value={customPrompt} onChange={e => setCustomPrompt(e.target.value)} className="min-h-[100px] dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Provide additional context to generate more targeted ideas
            </p>
          </CardContent>
        </Card>

        {/* Hashtags Input */}
        <Card className="mb-8 animate-fade-in dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Hashtags (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <Input placeholder="Enter hashtags (e.g., #SaaS, #Productivity, #AI)" value={hashtags} onChange={e => setHashtags(e.target.value)} className="text-lg p-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Add comma-separated hashtags to customize your idea generation
            </p>
          </CardContent>
        </Card>

        {/* Idea Count Slider */}
        <Card className="mb-8 animate-fade-in dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Number of Ideas: {ideaCount[0]}</CardTitle>
          </CardHeader>
          <CardContent>
            <Slider value={ideaCount} onValueChange={setIdeaCount} max={subscription.maxIdeasPerGeneration} min={1} step={1} className="w-full" />
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
              <span>1</span>
              <span>{subscription.maxIdeasPerGeneration} {subscription.plan === 'free' && '(Free limit)'}</span>
            </div>
            {subscription.plan === 'free' && <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                <Link to="/pricing" className="text-blue-600 hover:underline">
                  Upgrade to Pro
                </Link> to generate up to 20 ideas at once
              </p>}
          </CardContent>
        </Card>

        {/* Generate Button */}
        <div className="text-center mb-8">
          <Button size="lg" onClick={() => generateIdeaMutation.mutate()} disabled={!selectedNiche || generateIdeaMutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
            {generateIdeaMutation.isPending ? 'Generating...' : `Generate ${ideaCount[0]} Idea${ideaCount[0] > 1 ? 's' : ''}`}
          </Button>
        </div>

        {/* Generated Idea */}
        {generateIdeaMutation.isPending && <Card className="animate-fade-in dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-8">
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex space-x-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-18" />
                </div>
              </div>
            </CardContent>
          </Card>}

        {generateIdeaMutation.isError && <Alert className="mb-8 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700 dark:text-red-400">
              {generateIdeaMutation.error.message}
            </AlertDescription>
          </Alert>}

        {currentIdea && <Card className="animate-scale-in dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-900 dark:text-white">{currentIdea.businessName}</CardTitle>
              <Badge variant="secondary" className="w-fit">{currentIdea.niche}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">{currentIdea.description}</p>
              
              {currentIdea.hashtags.length > 0 && <div className="mb-6">
                  <h4 className="font-medium mb-2 dark:text-white">Hashtags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentIdea.hashtags.map((tag, index) => <Badge key={index} variant="outline" className="text-blue-600 dark:text-blue-400">
                        {tag.startsWith('#') ? tag : `#${tag}`}
                      </Badge>)}
                  </div>
                </div>}

              <div className="flex space-x-4">
                <Dialog open={showCodingPrompt} onOpenChange={setShowCodingPrompt}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                  if (!currentIdea.codingPrompt) {
                    generatePromptMutation.mutate();
                  } else {
                    setShowCodingPrompt(true);
                  }
                }} disabled={generatePromptMutation.isPending || !subscription.canGenerateCodingPrompts} className="bg-purple-600 hover:bg-purple-700">
                      <Code className="h-4 w-4 mr-2" />
                      {generatePromptMutation.isPending ? 'Generating...' : 'Get Coding Prompt'}
                      {!subscription.canGenerateCodingPrompts && <span className="ml-2 text-xs">(Pro only)</span>}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto dark:bg-gray-800">
                    <DialogHeader>
                      <div className="flex justify-between items-center">
                        <DialogTitle className="dark:text-white">Coding Prompt for {currentIdea.businessName}</DialogTitle>
                        {currentIdea.codingPrompt && <Button size="sm" variant="outline" onClick={() => copyToClipboard(currentIdea.codingPrompt || '')} className="ml-4">
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>}
                      </div>
                    </DialogHeader>
                    {currentIdea.codingPrompt && <div className="prose max-w-none">
                        <div className="whitespace-pre-wrap text-sm bg-gray-50 dark:bg-gray-700 p-4 rounded-lg dark:text-white">
                          {currentIdea.codingPrompt}
                        </div>
                      </div>}
                  </DialogContent>
                </Dialog>

                <Button onClick={() => saveIdeaMutation.mutate()} disabled={saveIdeaMutation.isPending} variant="outline" className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20">
                  <Save className="h-4 w-4 mr-2" />
                  {saveIdeaMutation.isPending ? 'Saving...' : 'Save Idea'}
                </Button>
              </div>
            </CardContent>
          </Card>}
      </div>
    </div>;
};
export default Dashboard;