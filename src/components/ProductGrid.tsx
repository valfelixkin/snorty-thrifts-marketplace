
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
          <Card key={i} className="animate-pulse nebula-card">
            <div className="bg-cosmic-dust h-48 rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="bg-cosmic-dust h-4 rounded mb-2"></div>
              <div className="bg-cosmic-dust h-3 rounded mb-3 w-3/4"></div>
              <div className="bg-cosmic-dust h-4 rounded w-1/2"></div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <div className="bg-cosmic-dust h-10 rounded w-full"></div>
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
        <AlertCircle className="w-16 h-16 text-primary mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">Error Loading Products</h3>
        <p className="text-muted-foreground text-center mb-4 max-w-md">
          {error.message || 'Something went wrong while loading products. Please try again.'}
        </p>
        <Button onClick={() => window.location.reload()} className="nebula-button">
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
        <div className="w-24 h-24 bg-cosmic-dust rounded-full flex items-center justify-center mb-4 red-glow">
          <Star className="w-12 h-12 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No Products Found</h3>
        <p className="text-muted-foreground text-center mb-6 max-w-md">
          We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
          <Button asChild className="nebula-button">
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
          <Card key={product.id} className="group nebula-card star-shimmer">
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
                className="absolute top-2 right-2 bg-card/80 hover:bg-card red-glow"
              />
              <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                {product.condition?.replace('_', ' ') || 'good'}
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
                <span className="font-bold cosmic-text text-lg">
                  {formatPrice(product.price)}
                </span>
                {product.original_price && (
                  <span className="text-muted-foreground line-through text-sm">
                    {formatPrice(product.original_price)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="w-3 h-3 fill-primary text-primary" />
                <span>4.5</span>
                <span>•</span>
                <span>{product.seller?.username || 'Anonymous'}</span>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button asChild className="w-full nebula-button">
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
