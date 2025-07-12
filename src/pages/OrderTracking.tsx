
import React from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import OrderTracking from '@/components/OrderTracking';

const OrderTrackingPage = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
          <h1 className="text-3xl font-montserrat font-bold text-brand-black">
            Track Your Order
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor the status and location of your order in real-time
          </p>
        </div>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Order Details</h3>
                  <p className="text-sm text-gray-600">Order #{orderId}</p>
                  <p className="text-sm text-gray-600">Placed on January 15, 2024</p>
                  <p className="text-sm text-gray-600">Total: KSH 25,000</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                  <p className="text-sm text-gray-600">
                    John Doe<br />
                    123 Main Street<br />
                    Nairobi, Kenya
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Contact Info</h3>
                  <p className="text-sm text-gray-600">john.doe@email.com</p>
                  <p className="text-sm text-gray-600">+254 700 123 456</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Timeline */}
          <OrderTracking orderId={orderId || 'N/A'} />

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <img
                    src="/placeholder.svg"
                    alt="Product"
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">iPhone 13 Pro Max</h3>
                    <p className="text-sm text-gray-600">Space Gray, 256GB</p>
                    <p className="text-sm font-medium">KSH 120,000</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Qty: 1</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
