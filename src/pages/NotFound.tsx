
import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-9xl font-montserrat font-bold text-brand-red-600 mb-4">404</h1>
          <h2 className="text-2xl font-montserrat font-bold text-brand-black mb-4">
            Oops! Page not found
          </h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="gradient-red text-white font-montserrat font-semibold">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link to="/shop">
            <Button variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Browse Shop
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
