
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shirt, Laptop, Sofa, Book, Headphones, Camera, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';

const Index = () => {
  const categories = [
    { name: 'Fashion', icon: Shirt, count: '2.3k items', color: 'from-pink-500 to-rose-500' },
    { name: 'Electronics', icon: Laptop, count: '1.8k items', color: 'from-blue-500 to-cyan-500' },
    { name: 'Furniture', icon: Sofa, count: '945 items', color: 'from-green-500 to-emerald-500' },
    { name: 'Books', icon: Book, count: '1.2k items', color: 'from-purple-500 to-violet-500' },
    { name: 'Audio', icon: Headphones, count: '687 items', color: 'from-orange-500 to-amber-500' },
    { name: 'Cameras', icon: Camera, count: '432 items', color: 'from-red-500 to-pink-500' },
  ];

  const featuredProducts = [
    {
      id: '1',
      name: 'Vintage Leather Jacket',
      price: 11570,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
      seller: 'StyleMaven',
      rating: 4.8,
      condition: 'Like New'
    },
    {
      id: '2',
      name: 'iPhone 13 Pro',
      price: 89870,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
      seller: 'TechHub',
      rating: 4.9,
      condition: 'Excellent'
    },
    {
      id: '3',
      name: 'Mid-Century Modern Chair',
      price: 31850,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
      seller: 'HomeDesign',
      rating: 4.7,
      condition: 'Good'
    },
    {
      id: '4',
      name: 'Rare Vinyl Collection',
      price: 20280,
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
      seller: 'MusicLover',
      rating: 5.0,
      condition: 'Very Good'
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative gradient-black-red text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-montserrat font-bold mb-6">
              Welcome to <span className="text-brand-red-400">Snorty Thrifts</span>
            </h1>
            <p className="text-xl md:text-2xl font-open-sans font-light mb-8 max-w-3xl mx-auto">
              Where Everything Finds a New Home
            </p>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
              Discover unique finds from our community-driven marketplace. Fashion, electronics, furniture, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop">
                <Button size="lg" className="bg-white text-brand-black hover:bg-gray-100 font-montserrat font-semibold">
                  Start Shopping
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/sell">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-black font-montserrat font-semibold">
                  Sell with Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-brand-black mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find exactly what you're looking for in our carefully curated categories
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link key={category.name} to={`/shop?category=${category.name.toLowerCase()}`}>
                <Card className="hover-scale card-shadow cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      <category.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-montserrat font-semibold text-brand-black mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">{category.count}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-brand-black mb-4">
                Trending Now
              </h2>
              <p className="text-lg text-gray-600">
                Popular items from our community
              </p>
            </div>
            <Link to="/shop">
              <Button variant="outline" className="hidden md:flex">
                View All
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <Card className="hover-scale card-shadow cursor-pointer group overflow-hidden">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                      {product.condition}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-montserrat font-semibold text-brand-black mb-2 group-hover:text-brand-red-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-brand-red-600">
                        {formatPrice(product.price)}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">{product.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">by {product.seller}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-red text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <TrendingUp className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6">
            Ready to Start Selling?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of sellers who trust Snorty Thrifts to reach buyers worldwide
          </p>
          <Link to="/sell">
            <Button size="lg" className="bg-white text-brand-red-600 hover:bg-gray-100 font-montserrat font-semibold">
              List Your First Item
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
