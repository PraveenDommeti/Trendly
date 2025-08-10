
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-trendly-light to-trendly-primary">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">Trendly</h1>
        <p className="text-white text-lg">Share your style. Shop the trends.</p>
      </div>
      
      <div className="w-full max-w-xs flex flex-col gap-4">
        <Link to="/" className="w-full">
          <Button className="w-full bg-white text-trendly-primary hover:bg-gray-100">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
