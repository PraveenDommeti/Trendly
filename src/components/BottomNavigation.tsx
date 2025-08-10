
import { Link, useLocation } from "react-router-dom";
import { Home, PlusSquare, ShoppingBag, Award, User, Wallet, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNavigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="bottom-nav bg-white dark:bg-gray-800 dark:border-t dark:border-gray-700">
      <Link 
        to="/" 
        className={cn(
          "flex flex-col items-center justify-center text-sm",
          isActive("/") ? "text-trendly-primary" : "text-gray-500 dark:text-gray-400"
        )}
      >
        <Home size={20} />
        <span className="text-xs mt-1">Home</span>
      </Link>
      
      <Link 
        to="/shop" 
        className={cn(
          "flex flex-col items-center justify-center text-sm",
          isActive("/shop") ? "text-trendly-primary" : "text-gray-500 dark:text-gray-400"
        )}
      >
        <ShoppingBag size={20} />
        <span className="text-xs mt-1">Shop</span>
      </Link>
      
      <Link 
        to="/post" 
        className={cn(
          "flex flex-col items-center justify-center text-sm",
          isActive("/post") ? "text-trendly-primary" : "text-gray-500 dark:text-gray-400"
        )}
      >
        <PlusSquare size={24} />
        <span className="text-xs mt-1">Create</span>
      </Link>
      
      <Link 
        to="/trendly-pay" 
        className={cn(
          "flex flex-col items-center justify-center text-sm",
          isActive("/trendly-pay") ? "text-trendly-primary" : "text-gray-500 dark:text-gray-400"
        )}
      >
        <Wallet size={20} />
        <span className="text-xs mt-1">Pay</span>
      </Link>
      
      <Link 
        to="/trendly-tokens" 
        className={cn(
          "flex flex-col items-center justify-center text-sm",
          isActive("/trendly-tokens") ? "text-trendly-primary" : "text-gray-500 dark:text-gray-400"
        )}
      >
        <Coins size={20} />
        <span className="text-xs mt-1">Rewards</span>
      </Link>
    </div>
  );
};

export default BottomNavigation;
