
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Package, DollarSign, Eye, MessageCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Items Listed', value: '12', icon: Package, color: 'text-blue-600' },
    { label: 'Total Sales', value: formatPrice(160420), icon: DollarSign, color: 'text-green-600' },
    { label: 'Profile Views', value: '89', icon: Eye, color: 'text-purple-600' },
    { label: 'Messages', value: '5', icon: MessageCircle, color: 'text-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-montserrat font-bold text-brand-black mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your account
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-brand-black">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Recent Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No listings yet</p>
                <Button className="mt-4 gradient-red text-white">
                  Create Your First Listing
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No orders yet</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
