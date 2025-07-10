
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useProduct } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import { Heart, Share2, ShoppingCart, Star, ArrowLeft, User, MapPin, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id!);
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-brand-black mb-4">Product not found</h1>
          <Button asChild>
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/placeholder.svg',
      seller: product.seller?.username || 'Anonymous'
    });
    toast.success('Added to cart!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/shop" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-white">
              <img
                src={product.images[selectedImageIndex] || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-brand-red-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
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
              <Badge className="mb-2 bg-brand-red-600">{product.condition}</Badge>
              <h1 className="text-3xl font-montserrat font-bold text-brand-black mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">4.5</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-600">32 reviews</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-brand-red-600">
                {formatPrice(product.price)}
              </span>
              {product.original_price && (
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Product Details */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-montserrat font-semibold mb-3">Product Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {product.brand && (
                    <div>
                      <span className="text-gray-500">Brand:</span>
                      <span className="ml-2 font-medium">{product.brand}</span>
                    </div>
                  )}
                  {product.size && (
                    <div>
                      <span className="text-gray-500">Size:</span>
                      <span className="ml-2 font-medium">{product.size}</span>
                    </div>
                  )}
                  {product.color && (
                    <div>
                      <span className="text-gray-500">Color:</span>
                      <span className="ml-2 font-medium">{product.color}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500">Condition:</span>
                    <span className="ml-2 font-medium capitalize">{product.condition}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-montserrat font-semibold mb-3">Seller Information</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-brand-red-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-brand-red-600" />
                  </div>
                  <div>
                    <p className="font-medium">{product.seller?.full_name || product.seller?.username || 'Anonymous'}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>4.8 (124 reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>Nairobi, Kenya</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Member since 2023</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                className="flex-1 gradient-red text-white"
                size="lg"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-sm text-gray-500">
              <p>• Free shipping within Nairobi</p>
              <p>• 30-day return policy</p>
              <p>• Secure payment guaranteed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
