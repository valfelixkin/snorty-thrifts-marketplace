
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, profile, signOut } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-card/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b galaxy-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 gradient-galaxy rounded-lg flex items-center justify-center cosmic-glow">
              <span className="text-white font-montserrat font-bold text-xl">ST</span>
            </div>
            <span className="font-montserrat font-bold text-xl text-foreground">
              Snorty <span className="text-primary">Thrifts</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Explore
            </Link>
            <Link to="/sell" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Sell
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search the marketplace..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-secondary/30 border-accent/30 focus:border-primary/60 text-foreground placeholder:text-muted-foreground"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            </div>
          </form>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-muted-foreground hover:text-primary transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center cosmic-glow">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative p-1">
                    <img
                      src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                      alt={profile?.full_name || user.email || 'User'}
                      className="w-8 h-8 rounded-full"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-md galaxy-border">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center space-x-2 cursor-pointer text-foreground hover:text-primary">
                      <User className="w-4 h-4" />
                      <span>Command Center</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/sell" className="flex items-center space-x-2 cursor-pointer text-foreground hover:text-primary">
                      <Plus className="w-4 h-4" />
                      <span>Launch Treasure</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive hover:text-destructive/90">
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="gradient-galaxy text-white cosmic-glow" size="sm">Join Snorty Thrifts</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-primary"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t galaxy-border bg-card/95 backdrop-blur-md">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search the marketplace..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full bg-secondary/30 border-accent/30"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              </div>
            </form>
            
            <div className="space-y-2">
              <Link
                to="/shop"
                className="block px-4 py-2 text-muted-foreground hover:bg-secondary/30 hover:text-primary rounded"
                onClick={() => setIsOpen(false)}
              >
                Explore
              </Link>
              <Link
                to="/sell"
                className="block px-4 py-2 text-muted-foreground hover:bg-secondary/30 hover:text-primary rounded"
                onClick={() => setIsOpen(false)}
              >
                Sell
              </Link>
              
              {!user && (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-muted-foreground hover:bg-secondary/30 hover:text-primary rounded"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 text-primary hover:bg-secondary/30 rounded"
                    onClick={() => setIsOpen(false)}
                  >
                    Join Snorty Thrifts
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
