
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Lightbulb, Check } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
          <Link to="/saved-ideas" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">
            Saved Ideas
          </Link>
          <Link to="/pricing" className="text-blue-600 font-medium">
            Pricing
          </Link>
          <ThemeToggle />
          <SignedOut>
            <Link to="/login">
              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                Sign In
              </Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-900 dark:text-white mb-4">Choose Your Plan</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">Start free and upgrade when you need more power</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <div className="text-4xl font-bold">$0<span className="text-lg font-normal text-gray-500">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Up to 3 ideas per generation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>All niche categories</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Custom hashtags</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Save unlimited ideas</span>
                </div>
                <div className="flex items-center space-x-2 opacity-50">
                  <span className="h-4 w-4 text-gray-400">✗</span>
                  <span>Coding prompts</span>
                </div>
              </div>
              <Button className="w-full" variant="outline">
                Get Started Free
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="relative border-blue-500">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
              Most Popular
            </Badge>
            <CardHeader>
              <CardTitle className="text-2xl">Pro</CardTitle>
              <div className="text-4xl font-bold">$19<span className="text-lg font-normal text-gray-500">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Up to 20 ideas per generation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>All niche categories</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Custom hashtags</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Save unlimited ideas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Detailed coding prompts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Priority support</span>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
