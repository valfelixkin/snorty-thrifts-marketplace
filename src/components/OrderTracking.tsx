
import React from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OrderTrackingProps {
  orderId: string;
}

interface TrackingStep {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'current' | 'pending';
  icon: React.ReactNode;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ orderId }) => {
  const trackingSteps: TrackingStep[] = [
    {
      id: '1',
      title: 'Order Confirmed',
      description: 'Your order has been confirmed and is being prepared',
      timestamp: '2024-01-15 10:30 AM',
      status: 'completed',
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      id: '2',
      title: 'Processing',
      description: 'Your order is being packed and prepared for shipment',
      timestamp: '2024-01-15 02:15 PM',
      status: 'completed',
      icon: <Package className="w-5 h-5" />
    },
    {
      id: '3',
      title: 'Shipped',
      description: 'Your order has been shipped and is on its way',
      timestamp: '2024-01-16 09:00 AM',
      status: 'current',
      icon: <Truck className="w-5 h-5" />
    },
    {
      id: '4',
      title: 'Delivered',
      description: 'Your order has been delivered successfully',
      timestamp: 'Estimated: 2024-01-18',
      status: 'pending',
      icon: <CheckCircle className="w-5 h-5" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'current':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-gray-400 bg-gray-100';
      default:
        return 'text-gray-400 bg-gray-100';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'current':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Order Tracking
          <Badge variant="outline">#{orderId}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {trackingSteps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-4">
              <div className={`p-2 rounded-full ${getStatusColor(step.status)}`}>
                {step.status === 'current' ? (
                  <Clock className="w-5 h-5 animate-pulse" />
                ) : (
                  step.icon
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900">{step.title}</h3>
                  {getStatusBadge(step.status)}
                </div>
                <p className="text-gray-600 text-sm mb-1">{step.description}</p>
                <p className="text-xs text-gray-500">{step.timestamp}</p>
              </div>
              {index < trackingSteps.length - 1 && (
                <div className="absolute left-6 mt-8 w-px h-8 bg-gray-200" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTracking;
