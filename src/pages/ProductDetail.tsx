
import React from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Share2, ShoppingCart, User, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProduct } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/utils';
import PaymentButton from '@/components/PaymentButton';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useProduct(id!);
  const { addToCart } = useCart();
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0] || '/placeholder.svg',
      seller: product.seller.full_name
    });
    
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart.`,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Product link has been copied to your clipboard.",
      });
    }
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Payment Successful!",
      description: "Your order has been processed successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-white">
              <img
                src={product.images[0] || '/placeholder.svg'}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden bg-white">
                    <img
                      src={image}
                      alt={`${product.title} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary">{product.category.name}</Badge>
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
              <h1 className="text-3xl font-montserrat font-bold text-brand-black mb-4">
                {product.title}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold text-brand-red-600">
                  {formatPrice(product.price)}
                </span>
                {product.original_price && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.original_price)}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              {product.condition && (
                <div>
                  <span className="font-medium text-gray-600">Condition:</span>
                  <p className="capitalize">{product.condition}</p>
                </div>
              )}
              {product.size && (
                <div>
                  <span className="font-medium text-gray-600">Size:</span>
                  <p>{product.size}</p>
                </div>
              )}
              {product.brand && (
                <div>
                  <span className="font-medium text-gray-600">Brand:</span>
                  <p>{product.brand}</p>
                </div>
              )}
              {product.color && (
                <div>
                  <span className="font-medium text-gray-600">Color:</span>
                  <p className="capitalize">{product.color}</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="font-montserrat font-semibold text-lg mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{product.seller.full_name}</h4>
                    <p className="text-sm text-gray-600">@{product.seller.username}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-4">
              <PaymentButton 
                amount={product.price}
                itemTitle={product.title}
                onPaymentSuccess={handlePaymentSuccess}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={handleAddToCart}
                  className="font-montserrat font-semibold"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="font-montserrat font-semibold"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Save
                </Button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Listed {new Date(product.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Nairobi, Kenya</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
