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
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-brand-red-600 to-brand-red-700 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-montserrat font-bold mb-6">
                Snorty Thrifts Marketplace
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Buy and sell amazing pre-loved items at unbeatable prices
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-brand-red-600 hover:bg-gray-100">
                  <Link to="/shop">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Start Shopping
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-red-600">
                  <Link to="/sell">
                    <Upload className="mr-2 h-5 w-5" />
                    Sell Your Items
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-montserrat font-bold text-brand-black mb-4">
                Why Choose Snorty Thrifts?
              </h2>
              <p className="text-gray-600 text-lg">
                The best marketplace for quality pre-loved items
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-brand-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-brand-red-600" />
                </div>
                <h3 className="text-xl font-montserrat font-semibold mb-2">Easy to Find</h3>
                <p className="text-gray-600">Search and filter through thousands of quality items</p>
              </div>
              
              <div className="text-center">
                <div className="bg-brand-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-brand-red-600" />
                </div>
                <h3 className="text-xl font-montserrat font-semibold mb-2">Quality Assured</h3>
                <p className="text-gray-600">All items are verified and rated by our community</p>
              </div>
              
              <div className="text-center">
                <div className="bg-brand-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-brand-red-600" />
                </div>
                <h3 className="text-xl font-montserrat font-semibold mb-2">Easy to Sell</h3>
                <p className="text-gray-600">List your items in minutes and reach thousands of buyers</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-montserrat font-bold text-brand-black mb-4">
                  Featured Items
                </h2>
                <p className="text-gray-600">
                  Discover amazing deals on quality pre-loved items
                </p>
              </div>
              <Button asChild variant="outline">
                <Link to="/shop">View All</Link>
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
                ))}
              </div>
            ) : displayProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayProducts.map((product) => (
                  <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={product.images[0] || '/placeholder.svg'}
                        alt={product.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <WishlistButton
                        productId={product.id}
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      />
                      <Badge className="absolute top-2 left-2 bg-brand-red-600">
                        {product.condition}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-montserrat font-semibold text-brand-black mb-2 line-clamp-2">
                        {product.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-brand-red-600">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>4.5</span>
                        <span>•</span>
                        <span>{product.seller?.username || 'Anonymous'}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button asChild className="w-full gradient-red text-white">
                        <Link to={`/product/${product.id}`}>View Details</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">No products available yet</p>
                <Button asChild>
                  <Link to="/sell">Be the first to sell something!</Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-brand-black text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-montserrat font-bold mb-4">
              Ready to Start Selling?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of sellers making money from items they no longer need
            </p>
            <Button asChild size="lg" className="gradient-red text-white">
              <Link to="/sell">
                <Upload className="mr-2 h-5 w-5" />
                List Your First Item
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Index;
