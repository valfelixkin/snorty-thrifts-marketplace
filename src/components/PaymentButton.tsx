
import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentButtonProps {
  amount: number;
  itemTitle: string;
  onPaymentSuccess?: () => void;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ 
  amount, 
  itemTitle, 
  onPaymentSuccess 
}) => {
  const { toast } = useToast();

  const handlePayment = () => {
    // This is a placeholder for payment integration
    // In a real app, you would integrate with payment providers like:
    // - Stripe
    // - PayPal
    // - M-Pesa (for Kenya)
    // - Flutterwave
    
    toast({
      title: "Payment Ready",
      description: `Payment system ready for ${itemTitle} - KSh ${amount.toLocaleString()}. Integration with payment providers can be added here.`,
    });
    
    if (onPaymentSuccess) {
      onPaymentSuccess();
    }
  };

  return (
    <Button 
      onClick={handlePayment}
      className="w-full gradient-red text-white font-montserrat font-semibold"
      size="lg"
    >
      <CreditCard className="w-5 h-5 mr-2" />
      Pay KSh {amount.toLocaleString()}
    </Button>
  );
};

export default PaymentButton;
