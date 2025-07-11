
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReturnFormData } from '@/types/return';

interface ReturnDetailsSectionProps {
  formData: ReturnFormData;
  setFormData: React.Dispatch<React.SetStateAction<ReturnFormData>>;
}

const ReturnDetailsSection = ({ formData, setFormData }: ReturnDetailsSectionProps) => {
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

  return (
    <>
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
    </>
  );
};

export default ReturnDetailsSection;
