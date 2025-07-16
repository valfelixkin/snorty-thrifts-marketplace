
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCategories } from '@/hooks/useCategories';
import { supabase } from '@/integrations/supabase/client';
import { UploadCloud } from 'lucide-react';
import ImagePreview from '@/components/ImagePreview';

const Sell = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [condition, setCondition] = useState<'new' | 'like_new' | 'good' | 'fair' | 'poor'>('good');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const handleImageUpload = async (files: FileList) => {
    if (!user) return;
    
    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${i}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (error) {
          console.error('Upload error:', error);
          toast({
            title: "Upload Failed",
            description: `Failed to upload ${file.name}: ${error.message}`,
            variant: "destructive",
          });
          continue;
        }

        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(data.path);

        uploadedUrls.push(urlData.publicUrl);
      }

      setImages(prev => [...prev, ...uploadedUrls]);
      toast({
        title: "Images Uploaded",
        description: `Successfully uploaded ${uploadedUrls.length} images`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to list an item",
        variant: "destructive",
      });
      return;
    }

    if (!title || !description || !price || !categoryId || !condition) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert the product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert({
          name: title,
          title: title,
          description: description,
          price: parseFloat(price),
          condition: condition,
          category_id: categoryId,
          seller_id: user.id,
          brand: brand || null,
          size: size || null,
          color: color || null,
          is_active: true,
          is_available: true,
          is_featured: false,
          main_image_url: images[0] || null
        })
        .select()
        .single();

      if (productError) {
        console.error('Product creation error:', productError);
        throw productError;
      }

      // Insert images if any
      if (images.length > 0) {
        const imageInserts = images.map((imageUrl, index) => ({
          product_id: productData.id,
          image_url: imageUrl,
          is_primary: index === 0
        }));

        const { error: imageError } = await supabase
          .from('product_images')
          .insert(imageInserts);

        if (imageError) {
          console.error('Image insertion error:', imageError);
          // Don't throw here as the product was created successfully
        }
      }

      toast({
        title: "Product Listed Successfully!",
        description: "Your product has been added to the marketplace",
      });

      // Reset form
      setTitle('');
      setDescription('');
      setPrice('');
      setCategoryId('');
      setCondition('good');
      setBrand('');
      setSize('');
      setColor('');
      setImages([]);

    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Listing Failed",
        description: "Failed to list your product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to sell items.",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [user, navigate, toast]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">List a New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Price (KSH)</Label>
                <Input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesLoading ? (
                      <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                    ) : (
                      categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="condition">Condition</Label>
                <Select value={condition} onValueChange={(value: 'new' | 'like_new' | 'good' | 'fair' | 'poor') => setCondition(value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="like_new">Like New</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="brand">Brand (Optional)</Label>
                <Input
                  type="text"
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="size">Size (Optional)</Label>
                <Input
                  type="text"
                  id="size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="color">Color (Optional)</Label>
                <Input
                  type="text"
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="images">Images</Label>
                <Input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      handleImageUpload(e.target.files);
                    }
                  }}
                  className="hidden"
                />
                <div className="flex justify-center">
                  <Label
                    htmlFor="images"
                    className="cursor-pointer py-3 px-4 inline-flex items-center gap-2 rounded border border-gray-200 bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red-600"
                  >
                    <UploadCloud className="h-4 w-4" />
                    {isUploading ? 'Uploading...' : 'Upload Images'}
                  </Label>
                </div>

                {images.length > 0 && (
                  <div className="mt-4">
                    <ImagePreview images={images} setImages={setImages} />
                  </div>
                )}
              </div>

              <Button disabled={isSubmitting} className="w-full gradient-red text-white" type="submit">
                {isSubmitting ? 'Submitting...' : 'List Product'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sell;
