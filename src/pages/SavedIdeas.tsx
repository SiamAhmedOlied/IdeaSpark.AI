import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Lightbulb, Trash2, Code, BookOpen, Copy } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSavedIdeas, deleteIdea, SavedIdea } from "@/lib/supabase";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useUserSubscription } from "@/hooks/useUserSubscription";
import { Skeleton } from "@/components/ui/skeleton";
const SavedIdeas = () => {
  const {
    user
  } = useUser();
  const subscription = useUserSubscription();
  const queryClient = useQueryClient();
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  const {
    data: savedIdeas = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['saved-ideas', user?.id],
    queryFn: () => getSavedIdeas(user?.id || ''),
    enabled: !!user?.id
  });
  const deleteIdeaMutation = useMutation({
    mutationFn: deleteIdea,
    onSuccess: () => {
      toast.success("Idea deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ['saved-ideas']
      });
    },
    onError: () => {
      toast.error("Failed to delete idea");
    }
  });
  const handleDeleteIdea = (id: string) => {
    deleteIdeaMutation.mutate(id);
  };
  const handleViewPrompt = (prompt: string) => {
    setSelectedPrompt(prompt);
    setShowPromptDialog(true);
  };
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };
  if (isLoading) {
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
            <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">
              Generate Ideas
            </Link>
            <Link to="/saved-ideas" className="text-blue-600 font-medium">
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
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-blue-900 dark:text-white mb-4">Your Saved Ideas</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Keep track of your favorite SaaS concepts and coding prompts.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({
            length: 6
          }).map((_, index) => <Card key={index} className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-20" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <div className="flex space-x-2 mb-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </CardContent>
              </Card>)}
          </div>
        </div>
      </div>;
  }
  if (error) {
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
            <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">
              Generate Ideas
            </Link>
            <Link to="/saved-ideas" className="text-blue-600 font-medium">
              Saved Ideas
            </Link>
            <Link to="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">
              Pricing
            </Link>
            <Badge variant={subscription.plan === 'pro' ? 'default' : 'secondary'}>
              {subscription.plan === 'pro' ? 'Pro' : 'Free'}
            </Badge>
            <ThemeToggle />
            <UserButton afterSignOutUrl="/" />
          </div>
        </nav>

        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Ideas</h2>
            <p className="text-gray-600 dark:text-gray-300">Failed to load your saved ideas. Please try again later.</p>
          </div>
        </div>
      </div>;
  }
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
          <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">
            Generate Ideas
          </Link>
          <Link to="/saved-ideas" className="text-blue-600 font-medium">
            Saved Ideas
          </Link>
          <Link to="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">
            Pricing
          </Link>
          <Badge variant={subscription.plan === 'pro' ? 'default' : 'secondary'}>
            {subscription.plan === 'pro' ? 'Pro' : 'Free'}
          </Badge>
          <ThemeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-900 dark:text-white mb-4">Your Saved Ideas</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">Keep track of your favorite SaaS concepts and coding prompts.</p>
        </div>

        {/* Ideas Grid */}
        {savedIdeas.length === 0 ? <Card className="text-center p-12 dark:bg-gray-800 dark:border-gray-700">
            <CardContent>
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">No saved ideas yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Start generating ideas to build your collection!</p>
              <Link to="/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Generate Your First Idea
                </Button>
              </Link>
            </CardContent>
          </Card> : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedIdeas.map(idea => <Card key={idea.id} className="hover:shadow-lg transition-shadow animate-fade-in dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-blue-900 dark:text-white mb-2">{idea.business_name}</CardTitle>
                      <Badge variant="secondary" className="mb-2">{idea.niche}</Badge>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteIdea(idea.id)} disabled={deleteIdeaMutation.isPending} className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">{idea.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {idea.hashtags.slice(0, 3).map((tag, index) => <Badge key={index} variant="outline" className="text-xs">
                          {tag.startsWith('#') ? tag : `#${tag}`}
                        </Badge>)}
                      {idea.hashtags.length > 3 && <Badge variant="outline" className="text-xs">
                          +{idea.hashtags.length - 3} more
                        </Badge>}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {idea.coding_prompt ? <Button size="sm" onClick={() => handleViewPrompt(idea.coding_prompt!)} className="bg-purple-600 hover:bg-purple-700 text-xs">
                        <Code className="h-3 w-3 mr-1" />
                        View Prompt
                      </Button> : <Button size="sm" variant="outline" disabled className="text-xs">
                        <Code className="h-3 w-3 mr-1" />
                        No Prompt
                      </Button>}
                  </div>

                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                    Saved on {new Date(idea.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>)}
          </div>}

        {/* Coding Prompt Dialog */}
        <Dialog open={showPromptDialog} onOpenChange={setShowPromptDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto dark:bg-gray-800">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle className="dark:text-white">Coding Prompt</DialogTitle>
                {selectedPrompt && <Button size="sm" variant="outline" onClick={() => copyToClipboard(selectedPrompt)} className="ml-4">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>}
              </div>
            </DialogHeader>
            {selectedPrompt && <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-sm bg-gray-50 dark:bg-gray-700 p-4 rounded-lg dark:text-white">
                  {selectedPrompt}
                </div>
              </div>}
          </DialogContent>
        </Dialog>
      </div>
    </div>;
};
export default SavedIdeas;