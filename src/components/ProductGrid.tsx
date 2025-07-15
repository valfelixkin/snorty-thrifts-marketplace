
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { Star, AlertCircle, Loader2 } from 'lucide-react';
import { Product } from '@/types';
import WishlistButton from './WishlistButton';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  error?: Error | null;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading, error }) => {
  console.log('ProductGrid render:', { productsLength: products?.length, isLoading, error });

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-3 rounded mb-3 w-3/4"></div>
              <div className="bg-gray-200 h-4 rounded w-1/2"></div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <div className="bg-gray-200 h-10 rounded w-full"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Products</h3>
        <p className="text-gray-600 text-center mb-4 max-w-md">
          {error.message || 'Something went wrong while loading products. Please try again.'}
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          <Loader2 className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <Star className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
        <p className="text-gray-600 text-center mb-6 max-w-md">
          We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
          <Button asChild>
            <Link to="/sell">List Your Item</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Products grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => {
        console.log('Rendering product:', product.id, product.title);
        
        return (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200">
            <div className="relative">
              <img
                src={product.images?.[0] || '/placeholder.svg'}
                alt={product.title}
                className="w-full h-48 object-cover rounded-t-lg"
                onError={(e) => {
                  console.log('Image failed to load for product:', product.id);
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              <WishlistButton
                productId={product.id}
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
              />
              <Badge className="absolute top-2 left-2 bg-brand-red-600 text-white">
                {product.condition?.replace('_', ' ') || 'good'}
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
        );
      })}
    </div>
  );
};

export default ProductGrid;
