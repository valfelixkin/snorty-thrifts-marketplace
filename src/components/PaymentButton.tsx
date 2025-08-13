
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CreditCard, Smartphone, DollarSign, Phone } from 'lucide-react';
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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      icon: Smartphone,
      description: 'Pay with M-Pesa STK Push',
      color: 'bg-green-600',
    },
    {
      id: 'equity',
      name: 'Equity Bank',
      icon: CreditCard,
      description: 'Pay with Equity Bank',
      color: 'bg-red-600',
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: DollarSign,
      description: 'Pay with PayPal',
      color: 'bg-blue-600',
    },
    {
      id: 'airtel',
      name: 'Airtel Money',
      icon: Phone,
      description: 'Pay with Airtel Money',
      color: 'bg-red-500',
    },
  ];

  const handlePayment = async (methodId: string) => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Payment Successful!",
        description: `Your payment of KSh ${amount.toLocaleString()} via ${paymentMethods.find(m => m.id === methodId)?.name} has been processed.`,
      });
      
      setIsOpen(false);
      setSelectedMethod('');
      setPhoneNumber('');
      
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    
    if (methodId === 'mpesa' || methodId === 'airtel') {
      // For mobile money, we need phone number
      return;
    }
    
    // For other methods, proceed directly
    handlePayment(methodId);
  };

  const handleMobilePayment = () => {
    if (!phoneNumber) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number to proceed.",
        variant: "destructive",
      });
      return;
    }
    
    if (!/^254\d{9}$/.test(phoneNumber.replace(/[^0-9]/g, ''))) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Kenyan phone number (e.g., 254712345678).",
        variant: "destructive",
      });
      return;
    }
    
    handlePayment(selectedMethod);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="w-full gradient-red text-white font-montserrat font-semibold"
          size="lg"
        >
          <CreditCard className="w-5 h-5 mr-2" />
          Pay KSh {amount.toLocaleString()}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-montserrat">Choose Payment Method</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center py-4 border-b">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-2xl font-bold text-brand-red-600">KSh {amount.toLocaleString()}</p>
            <p className="text-sm text-gray-500">{itemTitle}</p>
          </div>
          
          {!selectedMethod ? (
            <div className="grid grid-cols-1 gap-3">
              {paymentMethods.map((method) => (
                <Card 
                  key={method.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleMethodSelect(method.id)}
                >
                  <CardContent className="flex items-center p-4">
                    <div className={`w-12 h-12 ${method.color} rounded-lg flex items-center justify-center mr-4`}>
                      <method.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{method.name}</h3>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {React.createElement(
                      paymentMethods.find(m => m.id === selectedMethod)?.icon || CreditCard,
                      { className: "w-5 h-5 mr-2" }
                    )}
                    {paymentMethods.find(m => m.id === selectedMethod)?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(selectedMethod === 'mpesa' || selectedMethod === 'airtel') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        placeholder="254712345678"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter your number in format: 254XXXXXXXXX
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Button
                      onClick={selectedMethod === 'mpesa' || selectedMethod === 'airtel' ? handleMobilePayment : () => handlePayment(selectedMethod)}
                      className="w-full gradient-red text-white"
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : `Pay KSh ${amount.toLocaleString()}`}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedMethod('');
                        setPhoneNumber('');
                      }}
                      className="w-full"
                      disabled={isProcessing}
                    >
                      Choose Different Method
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentButton;
