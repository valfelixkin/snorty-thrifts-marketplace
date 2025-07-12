
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCategories } from '@/hooks/useCategories';
import { supabase } from '@/integrations/supabase/client';

const Sell = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    condition: '',
    price: '',
    images: [] as File[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const conditions = [
    { value: 'new', label: 'New' },
    { value: 'like_new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (formData.images.length + files.length > 5) {
      toast({
        title: "Too many images",
        description: "You can upload a maximum of 5 images",
        variant: "destructive",
      });
      return;
    }
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const uploadImages = async (itemId: string) => {
    const uploadedUrls = [];
    
    for (let i = 0; i < formData.images.length; i++) {
      const file = formData.images[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${itemId}_${i}.${fileExt}`;
      
      try {
        const { data, error } = await supabase.storage
          .from('item-images')
          .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('item-images')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
    
    return uploadedUrls;
  };

  const insertItemImages = async (itemId: string, imageUrls: string[]) => {
    const imageRecords = imageUrls.map((url, index) => ({
      item_id: itemId,
      image_url: url,
      is_primary: index === 0,
      sort_order: index
    }));

    const { error } = await supabase
      .from('item_images')
      .insert(imageRecords);

    if (error) {
      console.error('Error inserting item images:', error);
      throw error;
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter a product title",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.description.trim()) {
      toast({
        title: "Missing description",
        description: "Please enter a product description",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.category_id) {
      toast({
        title: "Missing category",
        description: "Please select a category",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.condition) {
      toast({
        title: "Missing condition",
        description: "Please select the item condition",
        variant: "destructive",
      });
      return false;
    }
    
    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price) || price <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price greater than 0",
        variant: "destructive",
      });
      return false;
    }
    
    if (formData.images.length === 0) {
      toast({
        title: "No images",
        description: "Please add at least one image of your item",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to sell items",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert the item first
      const { data: item, error: itemError } = await supabase
        .from('items')
        .insert({
          title: formData.title.trim(),
          description: formData.description.trim(),
          price: parseFloat(formData.price),
          category_id: formData.category_id,
          condition: formData.condition as 'new' | 'like_new' | 'good' | 'fair' | 'poor',
          seller_id: user.id,
          is_available: true
        })
        .select()
        .single();

      if (itemError) throw itemError;

      // Upload images and insert image records
      if (formData.images.length > 0) {
        const imageUrls = await uploadImages(item.id);
        if (imageUrls.length > 0) {
          await insertItemImages(item.id, imageUrls);
        }
      }

      toast({
        title: "Success!",
        description: "Your item has been listed successfully",
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        category_id: '',
        condition: '',
        price: '',
        images: []
      });

      navigate('/shop');
    } catch (error) {
      console.error('Error creating item:', error);
      toast({
        title: "Error",
        description: "Failed to create item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center p-8">
            <h2 className="text-2xl font-montserrat font-bold text-brand-black mb-4">
              Sign in to sell
            </h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in to list items for sale
            </p>
            <div className="space-y-3">
              <Button onClick={() => navigate('/login')} className="w-full gradient-red text-white">
                Sign In
              </Button>
              <Button onClick={() => navigate('/register')} variant="outline" className="w-full">
                Create Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-montserrat font-bold text-brand-black mb-4">
            Sell Your Item
          </h1>
          <p className="text-lg text-gray-600">
            List your item and reach thousands of potential buyers
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Item Photos</CardTitle>
              <p className="text-sm text-gray-600">Add up to 5 photos. The first photo will be your cover image.</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-brand-red-600 text-white text-xs px-2 py-1 rounded">
                        Cover
                      </div>
                    )}
                  </div>
                ))}
                
                {formData.images.length < 5 && (
                  <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-brand-red-400 transition-colors">
                    <Camera className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Add Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Item Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="What are you selling?"
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your item in detail..."
                  rows={5}
                  className="w-full"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <Select 
                    value={formData.category_id} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white max-h-60 overflow-y-auto">
                      {!categoriesLoading && categories && categories.length > 0 ? (
                        categories.map((category) => (
                          <SelectItem 
                            key={category.id} 
                            value={category.id}
                            className="hover:bg-gray-100 cursor-pointer"
                          >
                            {category.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-categories" disabled>
                          {categoriesLoading ? 'Loading categories...' : 'No categories available'}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
                    Condition *
                  </label>
                  <Select 
                    value={formData.condition} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {conditions.map((condition) => (
                        <SelectItem 
                          key={condition.value} 
                          value={condition.value}
                          className="hover:bg-gray-100 cursor-pointer"
                        >
                          {condition.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price (KSH) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">KSH</span>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                    className="pl-16"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-montserrat font-semibold text-lg text-brand-black">
                    Ready to list your item?
                  </h3>
                  <p className="text-gray-600">
                    Your item will go live immediately after submission
                  </p>
                </div>
                <div className="flex space-x-4">
                  <Button type="button" variant="outline" onClick={() => navigate('/')}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="gradient-red text-white font-montserrat font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Listing...' : 'List Item'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default Sell;
