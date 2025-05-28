
import { SignIn } from "@clerk/clerk-react";
import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Lightbulb className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-blue-900">IdeaSpark</h1>
          </div>
          <h2 className="text-xl text-gray-600">Welcome back! Sign in to continue generating amazing SaaS ideas.</h2>
        </div>
        
        <Card className="p-8 shadow-lg">
          <SignIn 
            redirectUrl="/dashboard" 
            fallbackRedirectUrl="/dashboard"
            appearance={{
              elements: {
                formButtonPrimary: 
                  "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
                card: "shadow-none",
                headerTitle: "text-blue-900",
                headerSubtitle: "text-gray-600"
              }
            }}
          />
        </Card>
      </div>
    </div>
  );
};

export default Login;
