
import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserSubscription } from "@/hooks/useUserSubscription";

interface DashboardNavigationProps {
  subscription: UserSubscription;
}

export const DashboardNavigation = ({ subscription }: DashboardNavigationProps) => {
  return (
    <nav className="flex justify-between items-center p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-blue-100 dark:border-gray-700">
      <div className="flex items-center space-x-2">
        <Lightbulb className="h-8 w-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-blue-900 dark:text-white">IdeaSpark</h1>
      </div>
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">
          Home
        </Link>
        <Link to="/dashboard" className="text-blue-600 font-medium">
          Generate Ideas
        </Link>
        <Link to="/saved-ideas" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">
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
  );
};
