
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface HashtagsInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const HashtagsInput = ({ value, onChange }: HashtagsInputProps) => {
  return (
    <Card className="mb-8 animate-fade-in dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="dark:text-white">Hashtags (Optional)</CardTitle>
      </CardHeader>
      <CardContent>
        <Input 
          placeholder="Enter hashtags (e.g., #SaaS, #Productivity, #AI)" 
          value={value} 
          onChange={e => onChange(e.target.value)} 
          className="text-lg p-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Add comma-separated hashtags to customize your idea generation
        </p>
      </CardContent>
    </Card>
  );
};
