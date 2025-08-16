import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AdPayment from './AdPayment';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().optional(),
  target_url: z.string().url('Please enter a valid URL'),
  image_url: z.string().url('Please enter a valid image URL').optional().or(z.literal('')),
  category: z.string().min(1, 'Please select a category'),
  location: z.string().optional(),
  budget: z.number().min(10, 'Minimum budget is $10'),
  daily_budget: z.number().min(1, 'Minimum daily budget is $1').optional(),
  duration_days: z.number().min(1, 'Minimum duration is 1 day').max(90, 'Maximum duration is 90 days'),
});

type FormData = z.infer<typeof formSchema>;

const categories = [
  'general', 'electronics', 'fashion', 'home', 'automotive', 
  'health', 'education', 'services', 'food', 'travel'
];

export default function CreateAdForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [adData, setAdData] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      target_url: '',
      image_url: '',
      category: '',
      location: '',
      budget: 50,
      daily_budget: 5,
      duration_days: 7,
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create an ad",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + data.duration_days);

      const adPayload = {
        advertiser_id: user.id,
        title: data.title,
        description: data.description || null,
        target_url: data.target_url,
        image_url: data.image_url || null,
        category: data.category,
        location: data.location || null,
        budget: data.budget,
        daily_budget: data.daily_budget || null,
        end_date: endDate.toISOString(),
        status: 'pending',
        payment_status: 'pending',
        is_active: false,
      };

      setAdData(adPayload);
      setShowPayment(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to prepare ad",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (paymentReference: string, paymentMethod: string) => {
    try {
      const { error } = await supabase.from('ads').insert({
        ...adData,
        payment_reference: paymentReference,
        payment_method: paymentMethod,
        payment_status: 'paid',
        status: 'pending', // Admin will activate after review
      });

      if (error) throw error;

      toast({
        title: "Ad created successfully!",
        description: "Your ad is pending review and will be activated within 24 hours.",
      });

      form.reset();
      setShowPayment(false);
      setAdData(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create ad",
        variant: "destructive",
      });
    }
  };

  if (showPayment && adData) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Complete Payment</CardTitle>
          <CardDescription>
            Pay ${adData.budget} to publish your ad for {form.getValues('duration_days')} days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdPayment
            amount={adData.budget}
            adTitle={adData.title}
            onPaymentSuccess={handlePaymentSuccess}
            onCancel={() => setShowPayment(false)}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Advertisement</CardTitle>
        <CardDescription>
          Reach your target audience by advertising on our platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ad Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your ad title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your product or service" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="target_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://your-website.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Where users will be redirected when they click your ad
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://your-image-url.com/image.jpg" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="City, Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Budget ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="daily_budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Budget ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration_days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (Days)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Creating...' : 'Create Ad & Proceed to Payment'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}