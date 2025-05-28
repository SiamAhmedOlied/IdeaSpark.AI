
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

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

interface NicheSelectorProps {
  selectedNiche: string;
  onNicheSelect: (niche: string) => void;
}

export const NicheSelector = ({ selectedNiche, onNicheSelect }: NicheSelectorProps) => {
  return (
    <Card className="mb-8 animate-fade-in dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 dark:text-white">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <span>Select Your Niche</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {niches.map(niche => (
            <Button 
              key={niche.id} 
              variant={selectedNiche === niche.id ? "default" : "outline"} 
              className={`h-12 ${selectedNiche === niche.id ? `${niche.color} text-white hover:opacity-90` : 'border-blue-200 dark:border-gray-600 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700'}`} 
              onClick={() => onNicheSelect(niche.id)}
            >
              {niche.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
