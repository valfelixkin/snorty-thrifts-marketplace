
# Snorty Thrifts - Seller Setup Guide

## Database Setup for Sellers

### 1. Create Storage Bucket for Item Images

Run this SQL in your Supabase SQL Editor:

\`\`\`sql
-- Create storage bucket for item images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'item-images',
  'item-images', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Create storage policies
CREATE POLICY "Anyone can view item images" ON storage.objects
FOR SELECT USING (bucket_id = 'item-images');

CREATE POLICY "Authenticated users can upload item images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'item-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own item images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'item-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own item images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'item-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
\`\`\`

### 2. Insert Test Categories

\`\`\`sql
INSERT INTO categories (name, slug, description) VALUES
('Electronics', 'electronics', 'Phones, computers, and electronic devices'),
('Fashion', 'fashion', 'Clothing, shoes, and accessories'),  
('Furniture', 'furniture', 'Home and office furniture'),
('Books', 'books', 'Books, magazines, and educational materials'),
('Sports', 'sports', 'Sports equipment and outdoor gear'),
('Collectibles', 'collectibles', 'Rare items and collectibles'),
('Home & Garden', 'home-garden', 'Home decor and gardening supplies'),
('Toys', 'toys', 'Toys and games for all ages')
ON CONFLICT (slug) DO NOTHING;
\`\`\`

### 3. Get Your User ID

1. Go to Supabase Dashboard > Authentication > Users
2. Find your user and copy the UUID
3. This will be your \`seller_id\` for test items

### 4. Insert Test Items

Replace \`YOUR_USER_ID_HERE\` with your actual user UUID:

\`\`\`sql
INSERT INTO items (
  title, description, price, condition, brand, size, color, 
  category_id, seller_id, is_available
) VALUES 
(
  'Vintage Leather Jacket',
  'Classic brown leather jacket in excellent condition. Perfect for casual wear.',
  120.00, 'good', 'Harley Davidson', 'L', 'Brown',
  (SELECT id FROM categories WHERE slug = 'fashion' LIMIT 1),
  'YOUR_USER_ID_HERE', true
),
(
  'iPhone 12 Pro', 
  'Unlocked iPhone 12 Pro with 128GB storage. Minor scratches but screen is perfect.',
  650.00, 'good', 'Apple', null, 'Space Gray',
  (SELECT id FROM categories WHERE slug = 'electronics' LIMIT 1),
  'YOUR_USER_ID_HERE', true
),
(
  'Nike Air Jordan 1',
  'Retro High OG sneakers in original box. Almost like new condition.',
  180.00, 'like_new', 'Nike', '10', 'Red/Black', 
  (SELECT id FROM categories WHERE slug = 'fashion' LIMIT 1),
  'YOUR_USER_ID_HERE', true
);
\`\`\`

### 5. Verify Your Data

\`\`\`sql
-- Check your items
SELECT i.title, i.price, c.name as category, i.condition
FROM items i 
LEFT JOIN categories c ON i.category_id = c.id
WHERE i.seller_id = 'YOUR_USER_ID_HERE';

-- Check categories
SELECT id, name, slug FROM categories ORDER BY name;
\`\`\`

## Testing the Seller Form

1. Make sure you're logged in to the app
2. Go to \`/sell\` route  
3. Fill out the form with test data
4. Upload 1-5 images
5. Submit and check your Supabase dashboard to verify the data was inserted

## Troubleshooting

- **"Select item must have value"**: Make sure categories are loaded and have valid IDs
- **"Storage error"**: Verify the item-images bucket exists and is public
- **"RLS policy error"**: Check that your user is authenticated and policies are set correctly
- **"Category not found"**: Run the category INSERT statements first

The form now properly handles:
- ✅ Non-empty Select values with proper categories mapping
- ✅ File uploads to Supabase Storage  
- ✅ Item insertion with all required fields
- ✅ Image metadata storage in item_images table
- ✅ Proper error handling and user feedback
