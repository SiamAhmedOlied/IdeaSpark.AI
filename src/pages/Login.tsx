
import { SignIn } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Lightbulb } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4" style={{ userSelect: 'none' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <Lightbulb className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-blue-900 dark:text-white">IdeaSpark</h1>
          </Link>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Welcome back</h2>
          <p className="text-gray-600 dark:text-gray-300">Sign in to continue generating amazing SaaS ideas</p>
        </div>

        {/* Sign In Component */}
        <div className="flex justify-center">
          <SignIn 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-xl border-0 bg-white dark:bg-gray-800",
                headerTitle: "text-blue-900 dark:text-white",
                headerSubtitle: "text-gray-600 dark:text-gray-300",
                socialButtonsBlockButton: "border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700",
                formFieldInput: "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white",
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
                footerActionLink: "text-blue-600 hover:text-blue-700",
              },
            }}
            redirectUrl="/dashboard"
            fallbackRedirectUrl="/dashboard"
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
            <Link to="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
