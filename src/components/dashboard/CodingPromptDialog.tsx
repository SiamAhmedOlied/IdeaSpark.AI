
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface GeneratedIdea {
  businessName: string;
  description: string;
  niche: string;
  hashtags: string[];
  codingPrompt?: string;
}

interface CodingPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentIdea: GeneratedIdea | null;
}

export const CodingPromptDialog = ({ open, onOpenChange, currentIdea }: CodingPromptDialogProps) => {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto dark:bg-gray-800">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="dark:text-white">
              Coding Prompt for {currentIdea?.businessName}
            </DialogTitle>
            {currentIdea?.codingPrompt && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => copyToClipboard(currentIdea.codingPrompt || '')}
                className="ml-4"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            )}
          </div>
        </DialogHeader>
        {currentIdea?.codingPrompt && (
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-sm bg-gray-50 dark:bg-gray-700 p-4 rounded-lg dark:text-white">
              {currentIdea.codingPrompt}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
