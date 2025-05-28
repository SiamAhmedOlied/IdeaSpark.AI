
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Lightbulb, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
      <div className="text-center px-6">
        <div className="flex items-center justify-center space-x-2 mb-8">
          <Lightbulb className="h-12 w-12 text-blue-600" />
          <h1 className="text-3xl font-bold text-blue-900">IdeaSpark</h1>
        </div>
        
        <div className="mb-8">
          <h2 className="text-6xl font-bold text-blue-900 mb-4">404</h2>
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h3>
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist. Let's get you back to generating amazing ideas!
          </p>
        </div>

        <div className="space-x-4">
          <Link to="/">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
