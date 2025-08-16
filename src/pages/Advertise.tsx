import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CreateAdForm from '@/components/ads/CreateAdForm';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Eye, MousePointer, Target, Clock, DollarSign, Users } from 'lucide-react';

export default function Advertise() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Advertise with Us</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Reach thousands of potential customers on our platform
            </p>
            <div className="space-y-4">
              <p className="text-lg">Please log in to create your first advertisement</p>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link to="/login">Log In</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Advertise on Snorty Thrifts</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with our engaged community of buyers and sellers. 
              Boost your business with targeted advertising that gets results.
            </p>
          </div>

          <Tabs defaultValue="create" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="create">Create Ad</TabsTrigger>
              <TabsTrigger value="pricing">Pricing & Info</TabsTrigger>
            </TabsList>

            <TabsContent value="create">
              <CreateAdForm />
            </TabsContent>

            <TabsContent value="pricing" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="text-center">
                    <Eye className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <CardTitle>High Visibility</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-muted-foreground">
                      Your ads are displayed prominently throughout our platform, 
                      ensuring maximum exposure to potential customers.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="text-center">
                    <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <CardTitle>Targeted Reach</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-muted-foreground">
                      Target specific categories and locations to reach 
                      the audience most likely to be interested in your offerings.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="text-center">
                    <MousePointer className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <CardTitle>Click Tracking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-muted-foreground">
                      Monitor your ad performance with detailed click tracking 
                      and analytics to optimize your campaigns.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Simple Pricing</CardTitle>
                  <CardDescription className="text-center">
                    Transparent pricing with no hidden fees
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center space-y-2">
                      <DollarSign className="w-8 h-8 mx-auto text-primary" />
                      <h3 className="text-lg font-semibold">Minimum Budget</h3>
                      <p className="text-muted-foreground">Starting at just $10 total budget</p>
                    </div>
                    <div className="text-center space-y-2">
                      <Clock className="w-8 h-8 mx-auto text-primary" />
                      <h3 className="text-lg font-semibold">Flexible Duration</h3>
                      <p className="text-muted-foreground">1-90 days campaign length</p>
                    </div>
                  </div>

                  <div className="bg-muted rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold mb-2">How It Works</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>1. Create your ad with compelling title and description</p>
                      <p>2. Set your budget and target audience</p>
                      <p>3. Pay securely with M-Pesa or Equity Bank</p>
                      <p>4. Your ad goes live after review (within 24 hours)</p>
                      <p>5. Track performance and results in real-time</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
                      <Users className="w-5 h-5" />
                      Our Audience
                    </h3>
                    <p className="text-muted-foreground">
                      Reach thousands of active buyers and sellers on Snorty Thrifts. 
                      Our users are engaged and ready to discover new products and services.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}