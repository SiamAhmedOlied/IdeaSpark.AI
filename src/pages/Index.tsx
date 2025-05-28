
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Lightbulb, Zap, Code, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 bg-white/80 backdrop-blur-sm border-b border-blue-100">
        <div className="flex items-center space-x-2">
          <Lightbulb className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-blue-900">IdeaSpark</h1>
        </div>
        <div className="flex items-center space-x-4">
          <SignedOut>
            <Link to="/login">
              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                Sign In
              </Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link to="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Dashboard
              </Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-bold text-blue-900 mb-6 leading-tight">
            Generate Unique SaaS Ideas
            <br />
            <span className="text-blue-600">Powered by AI</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover innovative business opportunities with AI-generated SaaS ideas, 
            complete with detailed coding prompts and implementation guides.
          </p>
          <SignedOut>
            <Link to="/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
                Get Started Free
              </Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link to="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
                Go to Dashboard
              </Button>
            </Link>
          </SignedIn>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow animate-scale-in">
            <Lightbulb className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered Ideas</h3>
            <p className="text-gray-600">Generate unique SaaS concepts tailored to specific niches and markets.</p>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow animate-scale-in">
            <Code className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Coding Prompts</h3>
            <p className="text-gray-600">Get detailed implementation guides with tech stacks and code snippets.</p>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow animate-scale-in">
            <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Niche Targeting</h3>
            <p className="text-gray-600">Focus on specific industries like FinTech, Healthcare, or Productivity.</p>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow animate-scale-in">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Save & Organize</h3>
            <p className="text-gray-600">Keep track of your favorite ideas and build your innovation pipeline.</p>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Spark Your Next Big Idea?</h3>
          <p className="text-xl mb-8 opacity-90">Join thousands of entrepreneurs building the future of SaaS.</p>
          <SignedOut>
            <Link to="/login">
              <Button size="lg" variant="secondary" className="bg-white text-blue-700 hover:bg-gray-100 text-lg px-8 py-4">
                Start Generating Ideas
              </Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link to="/dashboard">
              <Button size="lg" variant="secondary" className="bg-white text-blue-700 hover:bg-gray-100 text-lg px-8 py-4">
                Continue to Dashboard
              </Button>
            </Link>
          </SignedIn>
        </div>
      </div>
    </div>
  );
};

export default Index;
