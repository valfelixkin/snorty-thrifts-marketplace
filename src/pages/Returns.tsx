
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { useReturns } from '@/hooks/useReturns';
import { Calendar, Package, ArrowLeft } from 'lucide-react';

const Returns = () => {
  const navigate = useNavigate();
  const { data: returns, isLoading } = useReturns();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading returns...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'denied': return 'bg-red-100 text-red-800';
      case 'processed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-montserrat font-bold text-brand-black">
              My Returns
            </h1>
            <p className="text-gray-600 mt-2">
              Track and manage your return requests
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            <Button
              onClick={() => navigate('/returns/new')}
              className="gradient-red text-white font-montserrat font-semibold"
            >
              Request Return
            </Button>
          </div>
        </div>

        {!returns || returns.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No return requests
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't submitted any return requests yet.
              </p>
              <Button
                onClick={() => navigate('/returns/new')}
                className="gradient-red text-white font-montserrat font-semibold"
              >
                Request Your First Return
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {returns.map((returnRequest: any) => (
              <Card key={returnRequest.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-montserrat">
                      Return Request #{returnRequest.id.slice(-8)}
                    </CardTitle>
                    <Badge className={getStatusColor(returnRequest.status)}>
                      {returnRequest.status.charAt(0).toUpperCase() + returnRequest.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Item Details</h4>
                      <p className="text-gray-900 font-medium">
                        {returnRequest.items?.title}
                      </p>
                      <p className="text-brand-red-600 font-bold">
                        {formatPrice(returnRequest.items?.price || 0)}
                      </p>
                      <div className="flex items-center text-sm text-gray-600 mt-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        Requested {new Date(returnRequest.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Return Reason</h4>
                      <p className="text-gray-700 mb-2">{returnRequest.reason}</p>
                      {returnRequest.description && (
                        <p className="text-gray-600 text-sm">{returnRequest.description}</p>
                      )}
                      {returnRequest.refund_amount && (
                        <p className="text-green-600 font-semibold mt-2">
                          Refund Amount: {formatPrice(returnRequest.refund_amount)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {returnRequest.return_media && returnRequest.return_media.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Attached Media</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {returnRequest.return_media.map((media: any) => (
                          <div key={media.id} className="relative">
                            {media.media_type === 'image' ? (
                              <img
                                src={media.media_url}
                                alt="Return evidence"
                                className="w-full h-24 object-cover rounded-lg"
                              />
                            ) : (
                              <video
                                src={media.media_url}
                                className="w-full h-24 object-cover rounded-lg"
                                controls
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Returns;
