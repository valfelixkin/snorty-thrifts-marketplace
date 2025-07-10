
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/utils';
import PaymentButton from '@/components/PaymentButton';

const Checkout = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Nairobi',
    postalCode: ''
  });

  const subtotal = getTotalPrice();
  const shipping = 200; // KSh 200 shipping
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentSuccess = () => {
    clearCart();
    toast({
      title: "Order placed successfully!",
      description: "You will receive a confirmation email shortly.",
    });
    navigate('/');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <Button onClick={() => navigate('/shop')} className="gradient-red text-white">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-montserrat font-bold text-brand-black mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="fullName"
                  placeholder="Full Name"
                  value={shippingInfo.fullName}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={shippingInfo.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <Input
                name="phone"
                placeholder="Phone Number"
                value={shippingInfo.phone}
                onChange={handleInputChange}
                required
              />
              
              <Input
                name="address"
                placeholder="Street Address"
                value={shippingInfo.address}
                onChange={handleInputChange}
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="city"
                  placeholder="City"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  name="postalCode"
                  placeholder="Postal Code"
                  value={shippingInfo.postalCode}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Delivery within Nairobi and surrounding areas</span>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 pb-4 border-b border-gray-200">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              
              <div className="space-y-2 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span className="text-brand-red-600">{formatPrice(total)}</span>
                </div>
              </div>
              
              <div className="pt-4">
                <PaymentButton 
                  amount={total}
                  itemTitle={`Order of ${items.length} item${items.length > 1 ? 's' : ''}`}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              </div>
              
              <div className="text-xs text-gray-500 text-center space-y-1">
                <p>• Secure payment processing</p>
                <p>• M-Pesa, Visa & Mastercard accepted</p>
                <p>• Free returns within 7 days</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
