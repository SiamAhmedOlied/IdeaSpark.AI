
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface CustomPromptInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const CustomPromptInput = ({ value, onChange }: CustomPromptInputProps) => {
  return (
    <Card className="mb-8 animate-fade-in dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="dark:text-white">Custom Prompt (Optional)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Textarea 
            placeholder="Add specific requirements or details for your SaaS idea (e.g., 'focus on small businesses', 'mobile-first approach', 'AI-powered features')" 
            value={value} 
            onChange={e => onChange(e.target.value)} 
            className="min-h-[100px] dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Provide additional context to generate more targeted ideas
        </p>
      </CardContent>
    </Card>
  );
};
