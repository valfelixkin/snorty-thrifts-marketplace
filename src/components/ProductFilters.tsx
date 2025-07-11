
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Search, X } from 'lucide-react';

interface ProductFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  condition: string;
  setCondition: (condition: string) => void;
  brand: string;
  setBrand: (brand: string) => void;
  categories: any[];
  onClearFilters: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  priceRange,
  setPriceRange,
  condition,
  setCondition,
  brand,
  setBrand,
  categories,
  onClearFilters
}) => {
  const commonBrands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG', 'Dell', 'HP', 'Canon', 'Nikon'];

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Condition Filter */}
          <Select value={condition} onValueChange={setCondition}>
            <SelectTrigger>
              <SelectValue placeholder="Any Condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Condition</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="like_new">Like New</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="poor">Poor</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Price Range: KSH {priceRange[0].toLocaleString()} - KSH {priceRange[1].toLocaleString()}
            </label>
            <Slider
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              max={200000}
              min={100}
              step={1000}
              className="w-full"
            />
          </div>

          {/* Brand Filter */}
          <Select value={brand} onValueChange={setBrand}>
            <SelectTrigger>
              <SelectValue placeholder="Any Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Brand</SelectItem>
              {commonBrands.map((brandName) => (
                <SelectItem key={brandName} value={brandName}>
                  {brandName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        <Button
          onClick={onClearFilters}
          variant="outline"
          className="w-full md:w-auto"
        >
          <X className="w-4 h-4 mr-2" />
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductFilters;
