
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { Code, Save } from "lucide-react";
import { UserSubscription } from "@/hooks/useUserSubscription";

interface GeneratedIdea {
  businessName: string;
  description: string;
  niche: string;
  hashtags: string[];
  codingPrompt?: string;
}

interface IdeaDisplayProps {
  generatedIdeas: GeneratedIdea[];
  currentIdea: GeneratedIdea | null;
  onIdeaSelect: (idea: GeneratedIdea) => void;
  onGeneratePrompt: () => void;
  onSaveIdea: () => void;
  subscription: UserSubscription;
  isGeneratingPrompt: boolean;
  isSavingIdea: boolean;
}

export const IdeaDisplay = ({ 
  generatedIdeas, 
  currentIdea, 
  onIdeaSelect, 
  onGeneratePrompt, 
  onSaveIdea, 
  subscription, 
  isGeneratingPrompt, 
  isSavingIdea 
}: IdeaDisplayProps) => {
  if (generatedIdeas.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Idea Navigation */}
      {generatedIdeas.length > 1 && (
        <div className="flex justify-center space-x-2 mb-6">
          {generatedIdeas.map((idea, index) => (
            <Button
              key={index}
              variant={currentIdea === idea ? "default" : "outline"}
              size="sm"
              onClick={() => onIdeaSelect(idea)}
            >
              Idea {index + 1}
            </Button>
          ))}
        </div>
      )}

      {/* Current Idea Display */}
      {currentIdea && (
        <Card className="animate-scale-in dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-900 dark:text-white">
              {currentIdea.businessName}
            </CardTitle>
            <Badge variant="secondary" className="w-fit">{currentIdea.niche}</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              {currentIdea.description}
            </p>
            
            {currentIdea.hashtags.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-2 dark:text-white">Hashtags:</h4>
                <div className="flex flex-wrap gap-2">
                  {currentIdea.hashtags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-blue-600 dark:text-blue-400">
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <DialogTrigger asChild>
                <Button 
                  onClick={onGeneratePrompt}
                  disabled={isGeneratingPrompt || !subscription.canGenerateCodingPrompts} 
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Code className="h-4 w-4 mr-2" />
                  {isGeneratingPrompt ? 'Generating...' : 'Get Coding Prompt'}
                  {!subscription.canGenerateCodingPrompts && (
                    <span className="ml-2 text-xs">(Pro only)</span>
                  )}
                </Button>
              </DialogTrigger>

              <Button 
                onClick={onSaveIdea} 
                disabled={isSavingIdea} 
                variant="outline" 
                className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSavingIdea ? 'Saving...' : 'Save Idea'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
