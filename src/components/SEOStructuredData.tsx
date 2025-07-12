
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Product } from '@/types';

interface SEOStructuredDataProps {
  product?: Product;
  type?: 'website' | 'product' | 'organization';
}

const SEOStructuredData: React.FC<SEOStructuredDataProps> = ({ product, type = 'website' }) => {
  const getStructuredData = () => {
    const baseUrl = 'https://snorty-thrifts-marketplace.vercel.app';
    
    if (type === 'product' && product) {
      return {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.title,
        "description": product.description,
        "image": product.images,
        "brand": {
          "@type": "Brand",
          "name": product.brand || "Generic"
        },
        "offers": {
          "@type": "Offer",
          "url": `${baseUrl}/product/${product.id}`,
          "priceCurrency": "KES",
          "price": product.price,
          "itemCondition": `https://schema.org/${product.condition === 'new' ? 'NewCondition' : 'UsedCondition'}`,
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Person",
            "name": product.seller.full_name
          }
        },
        "category": product.category.name
      };
    }
    
    if (type === 'organization') {
      return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Snorty Thrifts Marketplace",
        "url": baseUrl,
        "logo": `${baseUrl}/logo.png`,
        "description": "Kenya's premier marketplace for quality pre-loved items",
        "sameAs": [
          "https://facebook.com/snortythrifts",
          "https://twitter.com/snortythrifts",
          "https://instagram.com/snortythrifts"
        ]
      };
    }
    
    // Default website schema
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Snorty Thrifts Marketplace",
      "url": baseUrl,
      "description": "Buy and sell quality pre-loved items at unbeatable prices",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${baseUrl}/shop?search={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    };
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(getStructuredData())}
      </script>
    </Helmet>
  );
};

export default SEOStructuredData;
