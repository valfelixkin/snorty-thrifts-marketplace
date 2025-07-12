
// Utility functions to help with inserting dummy data into Supabase

export const getDummyItems = () => {
  return [
    {
      title: "Vintage Leather Jacket",
      description: "Classic brown leather jacket in excellent condition. Perfect for casual wear or motorcycle riding.",
      price: 120.00,
      condition: "good",
      brand: "Harley Davidson",
      size: "L",
      color: "Brown"
    },
    {
      title: "iPhone 12 Pro",
      description: "Unlocked iPhone 12 Pro with 128GB storage. Minor scratches on the back but screen is perfect.",
      price: 650.00,
      condition: "good",
      brand: "Apple",
      color: "Space Gray"
    },
    {
      title: "Nike Air Jordan 1",
      description: "Retro High OG sneakers in original box. Worn only a few times, almost like new condition.",
      price: 180.00,
      condition: "like_new",
      brand: "Nike",
      size: "10",
      color: "Red/Black"
    },
    {
      title: "MacBook Air M1",
      description: "2020 MacBook Air with M1 chip, 8GB RAM, 256GB SSD. Perfect for students and professionals.",
      price: 850.00,
      condition: "like_new",
      brand: "Apple",
      color: "Silver"
    },
    {
      title: "Vintage Band T-Shirt",
      description: "Original 1990s Nirvana concert t-shirt. Rare collector's item in great condition.",
      price: 45.00,
      condition: "good",
      size: "M",
      color: "Black"
    }
  ];
};

export const getCategoriesSQL = () => {
  return `
-- First, get your category IDs:
SELECT id, name FROM categories ORDER BY name;

-- Example categories (run this if you don't have categories yet):
INSERT INTO categories (name, slug, description) VALUES
('Electronics', 'electronics', 'Phones, computers, and electronic devices'),
('Fashion', 'fashion', 'Clothing, shoes, and accessories'),
('Furniture', 'furniture', 'Home and office furniture'),
('Books', 'books', 'Books, magazines, and educational materials'),
('Sports', 'sports', 'Sports equipment and outdoor gear'),
('Collectibles', 'collectibles', 'Rare items and collectibles'),
('Home & Garden', 'home-garden', 'Home decor and gardening supplies'),
('Toys', 'toys', 'Toys and games for all ages');
  `;
};

export const getInsertItemsSQL = (sellerId: string) => {
  return `
-- Replace 'YOUR_USER_ID' with your actual user ID from auth.users
-- Replace category IDs with actual IDs from your categories table

INSERT INTO items (
  title, 
  description, 
  price, 
  condition, 
  brand, 
  size, 
  color, 
  category_id, 
  seller_id, 
  is_available
) VALUES 
(
  'Vintage Leather Jacket',
  'Classic brown leather jacket in excellent condition. Perfect for casual wear or motorcycle riding.',
  120.00,
  'good',
  'Harley Davidson',
  'L',
  'Brown',
  (SELECT id FROM categories WHERE slug = 'fashion' LIMIT 1),
  '${sellerId}',
  true
),
(
  'iPhone 12 Pro',
  'Unlocked iPhone 12 Pro with 128GB storage. Minor scratches on the back but screen is perfect.',
  650.00,
  'good',
  'Apple',
  null,
  'Space Gray',
  (SELECT id FROM categories WHERE slug = 'electronics' LIMIT 1),
  '${sellerId}',
  true
),
(
  'Nike Air Jordan 1',
  'Retro High OG sneakers in original box. Worn only a few times, almost like new condition.',  
  180.00,
  'like_new',
  'Nike',
  '10',
  'Red/Black',
  (SELECT id FROM categories WHERE slug = 'fashion' LIMIT 1),
  '${sellerId}',
  true
),
(
  'MacBook Air M1',
  '2020 MacBook Air with M1 chip, 8GB RAM, 256GB SSD. Perfect for students and professionals.',
  850.00,
  'like_new', 
  'Apple',
  null,
  'Silver',
  (SELECT id FROM categories WHERE slug = 'electronics' LIMIT 1),
  '${sellerId}',
  true
),
(
  'Vintage Band T-Shirt',
  'Original 1990s Nirvana concert t-shirt. Rare collector\'s item in great condition.',
  45.00,
  'good',
  null,
  'M', 
  'Black',
  (SELECT id FROM categories WHERE slug = 'fashion' LIMIT 1),
  '${sellerId}',
  true
);
  `;
};

export const getDummyDataInstructions = () => {
  return `
## How to Insert Dummy Data into Supabase

### Step 1: Get Your User ID
1. Go to Supabase Dashboard > Authentication > Users
2. Find your user account and copy the UUID (this is your seller_id)

### Step 2: Check/Insert Categories  
1. Go to Supabase Dashboard > SQL Editor
2. Run: SELECT id, name FROM categories ORDER BY name;
3. If no categories exist, run the categories INSERT statement from getCategoriesSQL()

### Step 3: Insert Test Items
1. In SQL Editor, run the INSERT statement from getInsertItemsSQL()  
2. Replace 'YOUR_USER_ID' with your actual user UUID
3. The query automatically maps category names to IDs

### Step 4: Add Item Images (Optional)
1. Go to Supabase Dashboard > Storage
2. Create a bucket named 'item-images' (make it public)
3. Upload some test images
4. Run: 
   INSERT INTO item_images (item_id, image_url, is_primary) 
   VALUES ('ITEM_ID', 'IMAGE_URL', true);

### Step 5: Verify Data
Run: 
SELECT i.*, c.name as category_name 
FROM items i 
LEFT JOIN categories c ON i.category_id = c.id 
WHERE i.seller_id = 'YOUR_USER_ID';
  `;
};
