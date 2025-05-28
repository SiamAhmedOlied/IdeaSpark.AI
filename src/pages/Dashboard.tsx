
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog } from "@/components/ui/dialog";
import { useUser } from "@clerk/clerk-react";
import { AlertCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { generateIdea, generateCodingPrompt } from "@/lib/gemini";
import { useUserSubscription } from "@/hooks/useUserSubscription";
import { saveIdea } from "@/lib/supabase";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { NicheSelector } from "@/components/dashboard/NicheSelector";
import { CustomPromptInput } from "@/components/dashboard/CustomPromptInput";
import { HashtagsInput } from "@/components/dashboard/HashtagsInput";
import { IdeaCountSlider } from "@/components/dashboard/IdeaCountSlider";
import { IdeaDisplay } from "@/components/dashboard/IdeaDisplay";
import { CodingPromptDialog } from "@/components/dashboard/CodingPromptDialog";

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
  const [generatedIdeas, setGeneratedIdeas] = useState<GeneratedIdea[]>([]);
  const [currentIdea, setCurrentIdea] = useState<GeneratedIdea | null>(null);
  const [showCodingPrompt, setShowCodingPrompt] = useState(false);
  const subscription = useUserSubscription();
  const queryClient = useQueryClient();
  const { user } = useUser();

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
      return await generateIdea(selectedNiche, hashtagArray, customPrompt, requestedCount);
    },
    onSuccess: ideas => {
      setGeneratedIdeas(ideas);
      setCurrentIdea(ideas[0]);
      toast.success(`${ideas.length} idea${ideas.length > 1 ? 's' : ''} generated successfully!`);
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
      if (!user) throw new Error('User not authenticated');
      return await saveIdea(currentIdea, user.id);
    },
    onSuccess: () => {
      toast.success('Idea saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['saved-ideas'] });
    },
    onError: error => {
      toast.error(error.message || 'Failed to save idea');
    }
  });

  const handleGeneratePrompt = () => {
    if (!currentIdea?.codingPrompt) {
      generatePromptMutation.mutate();
    } else {
      setShowCodingPrompt(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 select-none" style={{userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'}} onContextMenu={(e) => e.preventDefault()}>
      <DashboardNavigation subscription={subscription} />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-900 dark:text-white mb-4">Generate Your Next SaaS Idea</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">Select a niche, add hashtags, and let AI create unique business opportunities for you.</p>
        </div>

        <NicheSelector selectedNiche={selectedNiche} onNicheSelect={setSelectedNiche} />
        <CustomPromptInput value={customPrompt} onChange={setCustomPrompt} />
        <HashtagsInput value={hashtags} onChange={setHashtags} />
        <IdeaCountSlider ideaCount={ideaCount} onIdeaCountChange={setIdeaCount} subscription={subscription} />

        {/* Generate Button */}
        <div className="text-center mb-8">
          <Button 
            size="lg" 
            onClick={() => generateIdeaMutation.mutate()} 
            disabled={!selectedNiche || generateIdeaMutation.isPending} 
            className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4"
          >
            {generateIdeaMutation.isPending ? 'Generating...' : `Generate ${ideaCount[0]} Idea${ideaCount[0] > 1 ? 's' : ''}`}
          </Button>
        </div>

        {/* Loading State */}
        {generateIdeaMutation.isPending && (
          <div className="animate-fade-in dark:bg-gray-800 dark:border-gray-700 bg-white rounded-lg border p-8">
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
          </div>
        )}

        {/* Error State */}
        {generateIdeaMutation.isError && (
          <Alert className="mb-8 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700 dark:text-red-400">
              {generateIdeaMutation.error.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Ideas Display */}
        <Dialog open={showCodingPrompt} onOpenChange={setShowCodingPrompt}>
          <IdeaDisplay
            generatedIdeas={generatedIdeas}
            currentIdea={currentIdea}
            onIdeaSelect={setCurrentIdea}
            onGeneratePrompt={handleGeneratePrompt}
            onSaveIdea={() => saveIdeaMutation.mutate()}
            subscription={subscription}
            isGeneratingPrompt={generatePromptMutation.isPending}
            isSavingIdea={saveIdeaMutation.isPending}
          />
          <CodingPromptDialog
            open={showCodingPrompt}
            onOpenChange={setShowCodingPrompt}
            currentIdea={currentIdea}
          />
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;
