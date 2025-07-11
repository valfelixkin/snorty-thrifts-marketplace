
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateReturn } from '@/hooks/useReturns';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Upload, X, Image, Video } from 'lucide-react';

const NewReturn = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createReturn = useCreateReturn();

  const [formData, setFormData] = useState({
    item_id: '',
    order_id: '',
    reason: '',
    description: ''
  });
  
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  const returnReasons = [
    'Defective item',
    'Wrong item received',
    'Item not as described',
    'Damaged during shipping',
    'Changed my mind',
    'Item too small',
    'Item too large',
    'Other'
  ];

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (mediaFiles.length + files.length > 5) {
      alert('You can upload a maximum of 5 files');
      return;
    }
    setMediaFiles(prev => [...prev, ...files]);
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

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

    // Include status and all required fields for the return request
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
              <div>
                <label htmlFor="item_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Item ID *
                </label>
                <Input
                  id="item_id"
                  value={formData.item_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, item_id: e.target.value }))}
                  placeholder="Enter the item ID you want to return"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can find the item ID in your order confirmation email
                </p>
              </div>

              <div>
                <label htmlFor="order_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Order ID (Optional)
                </label>
                <Input
                  id="order_id"
                  value={formData.order_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, order_id: e.target.value }))}
                  placeholder="Enter your order ID if available"
                />
              </div>

              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Return *
                </label>
                <Select value={formData.reason} onValueChange={(value) => setFormData(prev => ({ ...prev, reason: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {returnReasons.map(reason => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Details
                </label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide additional details about your return request..."
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supporting Media (Images/Videos)
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Upload up to 5 images or videos to support your return request
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {mediaFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                        {file.type.startsWith('image/') ? (
                          <>
                            <Image className="w-8 h-8 text-gray-400" />
                            <span className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-50 px-1 rounded">
                              IMG
                            </span>
                          </>
                        ) : (
                          <>
                            <Video className="w-8 h-8 text-gray-400" />
                            <span className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-50 px-1 rounded">
                              VID
                            </span>
                          </>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                    </div>
                  ))}
                  
                  {mediaFiles.length < 5 && (
                    <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-brand-red-400 transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Add Media</span>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        className="hidden"
                        onChange={handleMediaUpload}
                      />
                    </label>
                  )}
                </div>
              </div>
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

export default NewReturn;
