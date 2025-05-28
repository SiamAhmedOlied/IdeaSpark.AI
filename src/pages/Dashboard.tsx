
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Lightbulb, Save, Code, Sparkles, AlertCircle } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { generateIdea, generateCodingPrompt } from "@/lib/gemini";

const niches = [
  { id: 'IT', name: 'IT', color: 'bg-blue-600' },
  { id: 'Finance', name: 'Finance', color: 'bg-green-600' },
  { id: 'Productivity', name: 'Productivity', color: 'bg-purple-600' },
  { id: 'Crypto', name: 'Crypto', color: 'bg-orange-600' },
  { id: 'Healthcare', name: 'Healthcare', color: 'bg-red-600' },
  { id: 'Business', name: 'Business', color: 'bg-indigo-600' },
  { id: 'Others', name: 'Others', color: 'bg-gray-600' }
];

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
  const [currentIdea, setCurrentIdea] = useState<GeneratedIdea | null>(null);
  const [showCodingPrompt, setShowCodingPrompt] = useState(false);

  const generateIdeaMutation = useMutation({
    mutationFn: async () => {
      if (!selectedNiche) {
        throw new Error('Please select a niche first');
      }
      const hashtagArray = hashtags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      return await generateIdea(selectedNiche, hashtagArray);
    },
    onSuccess: (idea) => {
      setCurrentIdea(idea);
      toast.success('New idea generated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to generate idea');
    }
  });

  const generatePromptMutation = useMutation({
    mutationFn: async () => {
      if (!currentIdea) throw new Error('No idea selected');
      return await generateCodingPrompt(currentIdea);
    },
    onSuccess: (codingPrompt) => {
      setCurrentIdea(prev => prev ? { ...prev, codingPrompt } : null);
      setShowCodingPrompt(true);
      toast.success('Coding prompt generated!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to generate coding prompt');
    }
  });

  const saveIdeaMutation = useMutation({
    mutationFn: async () => {
      if (!currentIdea) throw new Error('No idea to save');
      // In a real app, this would save to Supabase
      console.log('Saving idea:', currentIdea);
      return Promise.resolve();
    },
    onSuccess: () => {
      toast.success('Idea saved successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to save idea');
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 bg-white/80 backdrop-blur-sm border-b border-blue-100">
        <div className="flex items-center space-x-2">
          <Lightbulb className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-blue-900">IdeaSpark</h1>
        </div>
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link to="/dashboard" className="text-blue-600 font-medium">
            Generate Ideas
          </Link>
          <Link to="/saved-ideas" className="text-gray-600 hover:text-blue-600 transition-colors">
            Saved Ideas
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">Generate Your Next SaaS Idea</h2>
          <p className="text-xl text-gray-600">Select a niche, add hashtags, and let AI create unique business opportunities for you.</p>
        </div>

        {/* Niche Selection */}
        <Card className="mb-8 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <span>Select Your Niche</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {niches.map((niche) => (
                <Button
                  key={niche.id}
                  variant={selectedNiche === niche.id ? "default" : "outline"}
                  className={`h-12 ${
                    selectedNiche === niche.id 
                      ? `${niche.color} text-white hover:opacity-90` 
                      : 'border-blue-200 text-blue-700 hover:bg-blue-50'
                  }`}
                  onClick={() => setSelectedNiche(niche.id)}
                >
                  {niche.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hashtags Input */}
        <Card className="mb-8 animate-fade-in">
          <CardHeader>
            <CardTitle>Hashtags (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Enter hashtags (e.g., #SaaS, #Productivity, #AI)"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="text-lg p-4"
            />
            <p className="text-sm text-gray-500 mt-2">
              Add comma-separated hashtags to customize your idea generation
            </p>
          </CardContent>
        </Card>

        {/* Generate Button */}
        <div className="text-center mb-8">
          <Button
            size="lg"
            onClick={() => generateIdeaMutation.mutate()}
            disabled={!selectedNiche || generateIdeaMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4"
          >
            {generateIdeaMutation.isPending ? 'Generating...' : 'Generate New Idea'}
          </Button>
        </div>

        {/* Generated Idea */}
        {generateIdeaMutation.isPending && (
          <Card className="animate-fade-in">
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
          </Card>
        )}

        {generateIdeaMutation.isError && (
          <Alert className="mb-8 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {generateIdeaMutation.error.message}
            </AlertDescription>
          </Alert>
        )}

        {currentIdea && (
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-900">{currentIdea.businessName}</CardTitle>
              <Badge variant="secondary" className="w-fit">{currentIdea.niche}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-6 leading-relaxed">{currentIdea.description}</p>
              
              {currentIdea.hashtags.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Hashtags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentIdea.hashtags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-blue-600">
                        {tag.startsWith('#') ? tag : `#${tag}`}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <Dialog open={showCodingPrompt} onOpenChange={setShowCodingPrompt}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        if (!currentIdea.codingPrompt) {
                          generatePromptMutation.mutate();
                        } else {
                          setShowCodingPrompt(true);
                        }
                      }}
                      disabled={generatePromptMutation.isPending}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Code className="h-4 w-4 mr-2" />
                      {generatePromptMutation.isPending ? 'Generating...' : 'Get Coding Prompt'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Coding Prompt for {currentIdea.businessName}</DialogTitle>
                    </DialogHeader>
                    {currentIdea.codingPrompt && (
                      <div className="prose max-w-none">
                        <div className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">
                          {currentIdea.codingPrompt}
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                <Button
                  onClick={() => saveIdeaMutation.mutate()}
                  disabled={saveIdeaMutation.isPending}
                  variant="outline"
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saveIdeaMutation.isPending ? 'Saving...' : 'Save Idea'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
