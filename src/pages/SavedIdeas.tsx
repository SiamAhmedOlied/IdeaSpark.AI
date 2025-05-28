
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Lightbulb, Trash2, Code, BookOpen } from "lucide-react";
import { toast } from "sonner";

// Mock data for demonstration
const mockSavedIdeas = [
  {
    id: 1,
    businessName: "CloudSync Pro",
    niche: "IT",
    description: "A comprehensive cloud storage management platform that allows businesses to sync, organize, and secure their data across multiple cloud providers with advanced encryption and compliance features.",
    hashtags: ["#CloudStorage", "#DataSecurity", "#Enterprise"],
    codingPrompt: "Detailed coding prompt for CloudSync Pro...",
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    businessName: "FinanceFlow AI",
    niche: "Finance",
    description: "An AI-powered personal finance assistant that analyzes spending patterns, provides investment recommendations, and helps users optimize their financial decisions through machine learning algorithms.",
    hashtags: ["#FinTech", "#AI", "#PersonalFinance"],
    codingPrompt: null,
    createdAt: "2024-01-14"
  },
  {
    id: 3,
    businessName: "ProductivityPulse",
    niche: "Productivity",
    description: "A smart productivity tracker that uses time analytics and behavioral insights to help teams and individuals optimize their workflow, reduce burnout, and achieve better work-life balance.",
    hashtags: ["#Productivity", "#Analytics", "#Wellness"],
    codingPrompt: "Comprehensive development guide for ProductivityPulse...",
    createdAt: "2024-01-13"
  }
];

const SavedIdeas = () => {
  const [savedIdeas, setSavedIdeas] = useState(mockSavedIdeas);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [showPromptDialog, setShowPromptDialog] = useState(false);

  const handleDeleteIdea = (id: number) => {
    setSavedIdeas(savedIdeas.filter(idea => idea.id !== id));
    toast.success("Idea deleted successfully");
  };

  const handleViewPrompt = (prompt: string) => {
    setSelectedPrompt(prompt);
    setShowPromptDialog(true);
  };

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
          <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
            Generate Ideas
          </Link>
          <Link to="/saved-ideas" className="text-blue-600 font-medium">
            Saved Ideas
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">Your Saved Ideas</h2>
          <p className="text-xl text-gray-600">Keep track of your favorite SaaS concepts and coding prompts.</p>
        </div>

        {/* Ideas Grid */}
        {savedIdeas.length === 0 ? (
          <Card className="text-center p-12">
            <CardContent>
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No saved ideas yet</h3>
              <p className="text-gray-500 mb-6">Start generating ideas to build your collection!</p>
              <Link to="/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Generate Your First Idea
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedIdeas.map((idea) => (
              <Card key={idea.id} className="hover:shadow-lg transition-shadow animate-fade-in">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-blue-900 mb-2">{idea.businessName}</CardTitle>
                      <Badge variant="secondary" className="mb-2">{idea.niche}</Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteIdea(idea.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4 line-clamp-3">{idea.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {idea.hashtags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {idea.hashtags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{idea.hashtags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {idea.codingPrompt ? (
                      <Button
                        size="sm"
                        onClick={() => handleViewPrompt(idea.codingPrompt!)}
                        className="bg-purple-600 hover:bg-purple-700 text-xs"
                      >
                        <Code className="h-3 w-3 mr-1" />
                        View Prompt
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" disabled className="text-xs">
                        <Code className="h-3 w-3 mr-1" />
                        No Prompt
                      </Button>
                    )}
                  </div>

                  <p className="text-xs text-gray-400 mt-4">Saved on {idea.createdAt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Coding Prompt Dialog */}
        <Dialog open={showPromptDialog} onOpenChange={setShowPromptDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Coding Prompt</DialogTitle>
            </DialogHeader>
            {selectedPrompt && (
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">
                  {selectedPrompt}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SavedIdeas;
