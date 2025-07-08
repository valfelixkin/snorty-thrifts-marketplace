
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';

const Checkout = () => {
  const { items, totalPrice } = useCart();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-montserrat font-bold text-brand-black">
              Checkout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <h3 className="text-xl font-montserrat font-semibold text-brand-black mb-4">
                Checkout Coming Soon!
              </h3>
              <p className="text-gray-600 mb-6">
                Payment processing will be integrated in the next version.
              </p>
              <div className="text-2xl font-bold text-brand-red-600 mb-6">
                Total: {formatPrice(totalPrice * 1.08)}
              </div>
              <Button className="gradient-red text-white">
                Complete Order (Demo)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;
