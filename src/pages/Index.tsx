
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { formatPrice } from '@/lib/utils';
import { ArrowRight, Heart, Star } from 'lucide-react';

const Index = () => {
  const { data: featuredProducts, isLoading: productsLoading } = useProducts(true);
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-red-100 via-brand-red-50 to-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-montserrat font-bold text-brand-black mb-6">
            Find Amazing <span className="text-brand-red-600">Pre-Loved</span> Treasures
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover unique items, sustainable shopping, and incredible deals on quality pre-owned goods
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gradient-red text-white">
              <Link to="/shop">Start Shopping</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/sell">Sell Your Items</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-montserrat font-bold text-brand-black text-center mb-12">
            Shop by Category
          </h2>
          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-32"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories?.map((category) => (
                <Link
                  key={category.id}
                  to={`/shop?category=${category.id}`}
                  className="group text-center hover:scale-105 transition-transform"
                >
                  <div className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-brand-red-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-red-200 transition-colors">
                      <span className="text-2xl">{category.name.charAt(0)}</span>
                    </div>
                    <h3 className="font-montserrat font-medium text-brand-black">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-montserrat font-bold text-brand-black">
              Featured Items
            </h2>
            <Button asChild variant="outline">
              <Link to="/shop" className="flex items-center gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts?.slice(0, 4).map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={product.images[0] || '/placeholder.svg'}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Badge className="absolute top-2 left-2 bg-brand-red-600">
                      {product.condition}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-montserrat font-semibold text-brand-black mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-brand-red-600">
                        {formatPrice(product.price)}
                      </span>
                      {product.original_price && (
                        <span className="text-gray-400 line-through text-sm">
                          {formatPrice(product.original_price)}
                        </span>
                      )}
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
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-red-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-montserrat font-bold mb-4">
            Ready to Start Your Sustainable Shopping Journey?
          </h2>
          <p className="text-xl text-brand-red-100 mb-8">
            Join thousands of happy customers finding amazing deals every day
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/register">Join Snorty Thrifts Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
