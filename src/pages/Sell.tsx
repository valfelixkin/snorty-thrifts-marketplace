import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCategories } from '@/hooks/useCategories';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, X, ImageIcon } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Progress } from '@/components/ui/progress';

interface FormData {
  title: string;
  description: string;
  price: string;
  condition: string;
  categoryId: string;
  brand: string;
  size: string;
  color: string;
}

interface UploadedImage {
  file: File;
  preview: string;
  uploading?: boolean;
  uploaded?: boolean;
  progress?: number;
}

const Sell = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: '',
    condition: '',
    categoryId: '',
    brand: '',
    size: '',
    color: '',
  });

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const preview = URL.createObjectURL(file);
        setImages(prev => [...prev, { file, preview, uploading: false }]);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload only image files",
          variant: "destructive",
        });
      }
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const uploadImageToSupabase = async (file: File, index: number): Promise<string | null> => {
    try {
      // Update uploading state
      setImages(prev => prev.map((img, i) => 
        i === index ? { ...img, uploading: true, progress: 0 } : img
      ));

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `items/${fileName}`;

      const { data, error } = await supabase.storage
        .from('item-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('item-images')
        .getPublicUrl(filePath);

      // Update uploaded state
      setImages(prev => prev.map((img, i) => 
        i === index ? { ...img, uploading: false, uploaded: true, progress: 100 } : img
      ));

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      
      // Update error state
      setImages(prev => prev.map((img, i) => 
        i === index ? { ...img, uploading: false, uploaded: false, progress: 0 } : img
      ));

      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to sell items",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    // Validate form
    if (!formData.title || !formData.description || !formData.price || !formData.condition || !formData.categoryId) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (images.length === 0) {
      toast({
        title: "No images",
        description: "Please upload at least one image",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload all images
      const imageUrls: string[] = [];
      for (let i = 0; i < images.length; i++) {
        const url = await uploadImageToSupabase(images[i].file, i);
        if (url) {
          imageUrls.push(url);
        }
      }

      if (imageUrls.length === 0) {
        throw new Error('No images were uploaded successfully');
      }

      // Create the item in the database
      const { data: item, error: itemError } = await supabase
        .from('items')
        .insert({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          condition: formData.condition as any,
          category_id: formData.categoryId,
          brand: formData.brand || null,
          size: formData.size || null,
          color: formData.color || null,
          seller_id: user.id,
          is_available: true,
        })
        .select()
        .single();

      if (itemError) {
        console.error('Error creating item:', itemError);
        throw itemError;
      }

      // Add images to item_images table
      const imageInserts = imageUrls.map((url, index) => ({
        item_id: item.id,
        image_url: url,
        is_primary: index === 0,
        sort_order: index,
      }));

      const { error: imagesError } = await supabase
        .from('item_images')
        .insert(imageInserts);

      if (imagesError) {
        console.error('Error adding images:', imagesError);
        // Don't throw here as the item was created successfully
        toast({
          title: "Item created",
          description: "Item created but some images may not have been saved",
          variant: "default",
        });
      } else {
        toast({
          title: "Success!",
          description: "Your item has been listed successfully",
          variant: "default",
        });
      }

      // Redirect to the new product page
      navigate(`/product/${item.id}`);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to create listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner size="lg" text="Loading categories..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-montserrat font-bold text-brand-black mb-4">
            Sell Your Item
          </h1>
          <p className="text-gray-600">
            List your pre-loved items and reach thousands of potential buyers
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter item title"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your item in detail"
                  rows={4}
                  required
                />
              </div>

              {/* Price and Condition Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (KSH) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condition *</Label>
                  <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
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
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.categoryId} onValueChange={(value) => handleInputChange('categoryId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Optional Fields Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    placeholder="Brand name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Input
                    id="size"
                    value={formData.size}
                    onChange={(e) => handleInputChange('size', e.target.value)}
                    placeholder="Size"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    placeholder="Color"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <Label>Images *</Label>
                
                {/* Upload Button */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="images"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-gray-600">Click to upload images</span>
                    <span className="text-sm text-gray-400">PNG, JPG, GIF up to 10MB</span>
                  </label>
                </div>

                {/* Image Previews */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={image.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Upload Progress */}
                        {image.uploading && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                            <div className="text-white text-center">
                              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                              <span className="text-xs">Uploading...</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Success Badge */}
                        {image.uploaded && (
                          <div className="absolute top-2 left-2">
                            <Badge variant="default" className="bg-green-500">
                              ✓
                            </Badge>
                          </div>
                        )}

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        {/* Primary Badge */}
                        {index === 0 && (
                          <div className="absolute bottom-2 left-2">
                            <Badge variant="default">Primary</Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full gradient-red text-white" 
                disabled={isSubmitting || images.some(img => img.uploading)}
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Creating Listing...</span>
                  </>
                ) : (
                  'Create Listing'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sell;
