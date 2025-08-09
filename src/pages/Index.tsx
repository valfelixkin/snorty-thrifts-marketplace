import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingBag, Upload, Search } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { formatPrice } from '@/lib/utils';
import WishlistButton from '@/components/WishlistButton';
import SEOStructuredData from '@/components/SEOStructuredData';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  const { data: featuredProducts = [], isLoading } = useProducts();
  
  // Get first 8 products for featured section
  const displayProducts = featuredProducts.slice(0, 8);

  return (
    <>
      <Helmet>
        <title>Snorty Thrifts Marketplace - Buy & Sell Quality Pre-loved Items</title>
        <meta name="description" content="Discover amazing deals on quality pre-loved items at Snorty Thrifts Marketplace. Buy and sell electronics, fashion, furniture, and more at unbeatable prices in Kenya." />
      </Helmet>
      
      <SEOStructuredData type="website" />
      <SEOStructuredData type="organization" />
      
      <div className="min-h-screen nebula-bg">
        {/* Hero Section */}
        <section className="gradient-cosmic text-white py-20 relative overflow-hidden">
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-montserrat font-bold mb-6 cosmic-text">
                Snorty Thrifts Marketplace
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 text-gray-100">
                Discover cosmic deals in the universe of pre-loved treasures
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gradient-galaxy text-white cosmic-glow hover-scale">
                  <Link to="/shop">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Explore Marketplace
                  </Link>
                </Button>
                <Button asChild size="lg" className="galaxy-border bg-transparent text-white hover:bg-accent/20">
                  <Link to="/sell">
                    <Upload className="mr-2 h-5 w-5" />
                    Sell Your Treasures
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 space-bg relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-montserrat font-bold text-foreground mb-4">
                Why Choose Snorty Thrifts?
              </h2>
              <p className="text-muted-foreground text-lg">
                Your portal to cosmic treasures and stellar deals
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="bg-secondary/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 cosmic-glow group-hover:scale-110 transition-transform duration-300">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-montserrat font-semibold mb-2 text-foreground">Cosmic Discovery</h3>
                <p className="text-muted-foreground">Navigate through galaxies of quality items with advanced search</p>
              </div>
              
              <div className="text-center group">
                <div className="bg-accent/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 cosmic-glow group-hover:scale-110 transition-transform duration-300">
                  <Star className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-montserrat font-semibold mb-2 text-foreground">Stellar Quality</h3>
                <p className="text-muted-foreground">Every item verified by our intergalactic community standards</p>
              </div>
              
              <div className="text-center group">
                <div className="bg-primary/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 cosmic-glow group-hover:scale-110 transition-transform duration-300">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-montserrat font-semibold mb-2 text-foreground">Launch & Sell</h3>
                <p className="text-muted-foreground">Rocket your items to thousands of cosmic explorers instantly</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-montserrat font-bold text-foreground mb-4 galaxy-text-glow">
                  Cosmic Treasures
                </h2>
                <p className="text-muted-foreground text-lg">
                  Discover stellar deals across the marketplace
                </p>
              </div>
              <Button asChild className="galaxy-border hover:bg-accent/20">
                <Link to="/shop">Explore All</Link>
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-secondary/30 animate-pulse rounded-lg h-80 cosmic-glow"></div>
                ))}
              </div>
            ) : displayProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayProducts.map((product) => (
                  <Card key={product.id} className="group card-shadow hover-scale galaxy-border bg-card/90 backdrop-blur-sm">
                    <div className="relative overflow-hidden">
                      <img
                        src={product.images[0] || '/placeholder.svg'}
                        alt={product.title}
                        className="w-full h-48 object-cover rounded-t-lg group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <WishlistButton
                        productId={product.id}
                        className="absolute top-2 right-2 bg-card/80 hover:bg-card backdrop-blur-sm"
                      />
                      <Badge className="absolute top-2 left-2 gradient-galaxy text-white border-0">
                        {product.condition}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-montserrat font-semibold text-foreground mb-2 line-clamp-2">
                        {product.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-primary text-lg">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="w-3 h-3 fill-accent text-accent" />
                        <span>4.5</span>
                        <span>•</span>
                        <span>{product.seller?.username || 'Anonymous'}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button asChild className="w-full gradient-galaxy text-white cosmic-glow">
                        <Link to={`/product/${product.id}`}>Explore Treasure</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">No cosmic treasures available yet</p>
                <Button asChild className="gradient-galaxy cosmic-glow">
                  <Link to="/sell">Launch the first treasure!</Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="gradient-cosmic text-white py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/20 to-transparent"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl font-montserrat font-bold mb-4 galaxy-text-glow">
              Ready to Launch Your Treasures?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join the cosmic marketplace where stellar sellers turn forgotten items into galactic profits
            </p>
            <Button asChild size="lg" className="gradient-galaxy text-white cosmic-glow hover-scale">
              <Link to="/sell">
                <Upload className="mr-2 h-5 w-5" />
                Launch Your First Treasure
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Index;
