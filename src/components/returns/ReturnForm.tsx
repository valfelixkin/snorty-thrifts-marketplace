
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCreateReturn } from '@/hooks/useReturns';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { ReturnFormData } from '@/types/return';
import ReturnDetailsSection from './ReturnDetailsSection';
import MediaUploadSection from './MediaUploadSection';

const ReturnForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createReturn = useCreateReturn();

  const [formData, setFormData] = useState<ReturnFormData>({
    item_id: '',
    order_id: '',
    reason: '',
    description: ''
  });
  
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please log in to submit a return request');
      navigate('/login');
      return;
    }

    if (!formData.item_id || !formData.reason) {
      alert('Please fill in all required fields');
      return;
    }

    createReturn.mutate({
      returnData: {
        ...formData,
        user_id: user.id,
        order_id: formData.order_id || null,
        status: 'pending' as const,
        refund_amount: null
      },
      mediaFiles
    }, {
      onSuccess: () => {
        navigate('/returns');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-montserrat font-bold text-brand-black">
              Request Return
            </h1>
            <p className="text-gray-600 mt-2">
              Submit a return request with supporting evidence
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/returns')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Return Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ReturnDetailsSection 
                formData={formData}
                setFormData={setFormData}
              />
              <MediaUploadSection 
                mediaFiles={mediaFiles}
                setMediaFiles={setMediaFiles}
              />
            </CardContent>
          </Card>

          <div className="mt-8 flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/returns')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createReturn.isPending}
              className="gradient-red text-white font-montserrat font-semibold"
            >
              {createReturn.isPending ? 'Submitting...' : 'Submit Return Request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnForm;
