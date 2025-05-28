
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Link } from "react-router-dom";
import { UserSubscription } from "@/hooks/useUserSubscription";

interface IdeaCountSliderProps {
  ideaCount: number[];
  onIdeaCountChange: (value: number[]) => void;
  subscription: UserSubscription;
}

export const IdeaCountSlider = ({ ideaCount, onIdeaCountChange, subscription }: IdeaCountSliderProps) => {
  return (
    <Card className="mb-8 animate-fade-in dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="dark:text-white">Number of Ideas: {ideaCount[0]}</CardTitle>
      </CardHeader>
      <CardContent>
        <Slider 
          value={ideaCount} 
          onValueChange={onIdeaCountChange} 
          max={subscription.maxIdeasPerGeneration} 
          min={1} 
          step={1} 
          className="w-full" 
        />
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
          <span>1</span>
          <span>{subscription.maxIdeasPerGeneration} {subscription.plan === 'free' && '(Free limit)'}</span>
        </div>
        {subscription.plan === 'free' && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            <Link to="/pricing" className="text-blue-600 hover:underline">
              Upgrade to Pro
            </Link> to generate up to 20 ideas at once
          </p>
        )}
      </CardContent>
    </Card>
  );
};
