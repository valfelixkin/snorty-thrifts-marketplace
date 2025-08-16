import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Smartphone, CreditCard, ArrowLeft, Check } from 'lucide-react';

interface AdPaymentProps {
  amount: number;
  adTitle: string;
  onPaymentSuccess: (paymentReference: string, paymentMethod: string) => void;
  onCancel: () => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  requiresPhone: boolean;
}

export default function AdPayment({ amount, adTitle, onPaymentSuccess, onCancel }: AdPaymentProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      icon: <Smartphone className="w-5 h-5" />,
      description: 'Pay with M-Pesa mobile money',
      color: 'bg-green-600',
      requiresPhone: true
    },
    {
      id: 'equity',
      name: 'Equity Bank',
      icon: <CreditCard className="w-5 h-5" />,
      description: 'Pay with Equity Bank mobile banking',
      color: 'bg-red-600',
      requiresPhone: true
    }
  ];

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast({
        title: "Payment method required",
        description: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    const method = paymentMethods.find(m => m.id === selectedMethod);
    if (method?.requiresPhone && !phoneNumber) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate payment success (in real implementation, integrate with actual payment APIs)
      const paymentReference = `AD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      toast({
        title: "Payment successful!",
        description: `Payment processed via ${method?.name}`,
      });

      onPaymentSuccess(paymentReference, selectedMethod);
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedPaymentMethod = paymentMethods.find(m => m.id === selectedMethod);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onCancel} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Ad Details
        </Button>
        <Badge variant="secondary" className="text-lg font-semibold">
          ${amount}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ad Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-medium">{adTitle}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Total cost: ${amount} for advertising campaign
          </p>
        </CardContent>
      </Card>

      {!selectedMethod ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Select Payment Method</h3>
          <div className="grid gap-3">
            {paymentMethods.map((method) => (
              <Card 
                key={method.id}
                className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/20"
                onClick={() => setSelectedMethod(method.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${method.color} text-white`}>
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{method.name}</h4>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className={`p-2 rounded-full ${selectedPaymentMethod?.color} text-white`}>
                {selectedPaymentMethod?.icon}
              </div>
              {selectedPaymentMethod?.name}
            </CardTitle>
            <CardDescription>{selectedPaymentMethod?.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedPaymentMethod?.requiresPhone && (
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="254XXXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isProcessing}
                />
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedMethod('')}
                disabled={isProcessing}
                className="flex-1"
              >
                Change Method
              </Button>
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1 flex items-center gap-2"
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Pay ${amount}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}