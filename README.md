
# Snorty Thrifts - E-commerce Platform

A modern thrift store e-commerce platform built with React, TypeScript, and Supabase.

## Features

✅ **User Authentication**
- Sign up and login functionality
- User profiles and dashboard
- Secure authentication with Supabase

✅ **Product Management**
- Browse products by category
- Search functionality
- Product detail pages with images
- Seller profiles

✅ **Shopping Experience**
- Shopping cart functionality
- Wishlist/favorites
- Checkout process
- Payment integration ready

✅ **Responsive Design**
- Mobile-first approach
- Clean, modern UI with Tailwind CSS
- Optimized for all screen sizes

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **State Management**: React Context API, TanStack Query
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Database Schema

The app uses a PostgreSQL database with the following main tables:
- `categories` - Product categories
- `items` - Products/items for sale
- `profiles` - User profiles
- `orders` - Order management
- `order_items` - Order line items
- `reviews` - Product reviews
- `favorites` - User wishlists

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd snorty-thrifts
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the SQL migrations provided in the `supabase/migrations` folder
   - Update the Supabase configuration in your project

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Deployment Options

### 1. **Netlify** (Recommended for static hosting)
- Build command: `npm run build`
- Publish directory: `dist`
- Auto-deploys from Git repositories

### 2. **Vercel** (Great for React apps)
- Automatic deployment from GitHub
- Built-in analytics and performance monitoring

### 3. **Traditional Web Hosting**
- Upload the `dist` folder contents to your web server
- Ensure your server supports SPA routing

### 4. **Self-hosting**
- Use nginx or Apache to serve the built files
- Configure proper routing for single-page application

## Browser Compatibility

The website is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Payment Integration

The app includes a payment framework ready for integration with:
- **M-Pesa** (recommended for Kenya)
- **Stripe** (international cards)
- **PayPal**
- **Flutterwave** (African markets)

## Contact Information

- **Email**: kwenavalfelix@gmail.com
- **Phone**: +254727461439
- **Location**: Nairobi, Kenya

## Environment Variables

Create a `.env.local` file with:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Features Ready for Production

✅ User authentication and profiles
✅ Product catalog with search and filters
✅ Shopping cart and checkout flow
✅ Responsive design for all devices
✅ SEO-friendly structure
✅ Error handling and loading states
✅ Database with proper security policies

## Next Steps for Full Production

1. **Payment Integration**: Connect with actual payment providers
2. **Email Notifications**: Set up transactional emails
3. **Image Upload**: Configure file storage for product images
4. **Analytics**: Add Google Analytics or similar
5. **Performance Monitoring**: Implement error tracking
6. **Testing**: Add comprehensive test coverage

## License

This project is ready for commercial use.
