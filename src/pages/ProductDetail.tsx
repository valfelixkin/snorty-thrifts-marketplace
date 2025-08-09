
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Heart, Share2, Star, MapPin, Calendar, Package } from 'lucide-react';
import { useProduct } from '@/hooks/useProducts';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import WishlistButton from '@/components/WishlistButton';
import SEOStructuredData from '@/components/SEOStructuredData';
import { Helmet } from 'react-helmet-async';
import PaymentButton from '@/components/PaymentButton';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { addToCart } = useCart();
  
  const { data: product, isLoading, error } = useProduct(id || '');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center p-8">
            <h2 className="text-2xl font-montserrat font-bold text-brand-black mb-4">
              Product Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/shop')} className="gradient-red text-white">
              Browse Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    // Transform Product to CartItem format
    const cartItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0] || '/placeholder.svg', // Use first image or fallback
      seller: product.seller.full_name,
    };

    addToCart(cartItem);
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart`,
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>{product.title} - Snorty Thrifts Marketplace</title>
        <meta name="description" content={`${product.description.substring(0, 160)}...`} />
        <meta property="og:title" content={`${product.title} - Snorty Thrifts Marketplace`} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.images[0] || '/placeholder.svg'} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={product.price.toString()} />
        <meta property="product:price:currency" content="KES" />
      </Helmet>
      
      <SEOStructuredData product={product} type="product" />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-8 hover:bg-gray-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={product.images[selectedImageIndex] || '/placeholder.svg'}
                  alt={product.title}
                  className="w-full h-96 object-cover rounded-lg border"
                />
                <WishlistButton
                  productId={product.id}
                  className="absolute top-4 right-4 bg-white/80 hover:bg-white"
                />
              </div>
              
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                        selectedImageIndex === index ? 'border-brand-red-600' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-3xl font-montserrat font-bold text-brand-black">
                    {product.title}
                  </h1>
                  <Button variant="ghost" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className="bg-brand-red-100 text-brand-red-800">
                    {product.condition}
                  </Badge>
                  <Badge variant="outline">
                    {product.category.name}
                  </Badge>
                </div>

                <div className="text-3xl font-bold text-brand-red-600 mb-4">
                  {formatPrice(product.price)}
                </div>

                <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>4.5 (24 reviews)</span>
                  <span>•</span>
                  <span>Sold by {product.seller.full_name}</span>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold text-lg mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span>Condition: {product.condition}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Listed {new Date(product.created_at).toLocaleDateString()}</span>
                </div>
                {product.brand && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Brand:</span>
                    <span>{product.brand}</span>
                  </div>
                )}
                {product.size && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Size:</span>
                    <span>{product.size}</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <Button
                  onClick={handleAddToCart}
                  className="w-full gradient-red text-white font-semibold py-3"
                  size="lg"
                >
                  Add to Cart
                </Button>

                <PaymentButton amount={product.price} itemTitle={product.title} />
                
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full">
                    Contact Seller
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Heart className="mr-2 h-4 w-4" />
                    Save for Later
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Seller Info */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-montserrat">Seller Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-red-100 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-brand-red-600">
                    {product.seller.full_name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{product.seller.full_name}</h4>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>4.8 rating</span>
                    <span>•</span>
                    <span>156 items sold</span>
                  </div>
                </div>
                <Button variant="outline">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Related Products */}
          <div>
            <h2 className="text-2xl font-montserrat font-bold text-brand-black mb-6">
              Similar Items
            </h2>
            <div className="text-center py-8 text-gray-500">
              <p>Similar items will be displayed here</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/shop">Browse All Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
