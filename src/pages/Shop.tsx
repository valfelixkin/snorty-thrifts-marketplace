import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/useCategories';
import { usePaginatedProducts } from '@/hooks/usePaginatedProducts';
import { useDebounced } from '@/hooks/useDebounced';
import ProductFilters from '@/components/ProductFilters';
import ProductGrid from '@/components/ProductGrid';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || 'all');
  const [priceRange, setPriceRange] = useState<[number, number]>([100, 100000]);
  const [condition, setCondition] = useState('any');
  const [brand, setBrand] = useState('any');
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search term to reduce API calls
  const debouncedSearchTerm = useDebounced(searchTerm, 500);

  // Memoize the query parameters to prevent unnecessary re-renders
  const queryParams = useMemo(() => ({
    page: currentPage,
    pageSize: 12,
    categoryId: selectedCategory === 'all' ? undefined : selectedCategory,
    searchTerm: debouncedSearchTerm || undefined,
    sortBy,
    priceRange: priceRange[0] !== 100 || priceRange[1] !== 100000 ? priceRange : undefined,
    condition: condition === 'any' ? undefined : condition,
    brand: brand === 'any' ? undefined : brand,
  }), [currentPage, selectedCategory, debouncedSearchTerm, sortBy, priceRange, condition, brand]);

  const { data: paginatedData, isLoading, error } = usePaginatedProducts(queryParams);

  // Log for debugging
  console.log('Shop component state:', {
    queryParams,
    paginatedData,
    isLoading,
    error
  });

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange([100, 100000]);
    setCondition('any');
    setBrand('any');
    setSortBy('newest');
    setCurrentPage(1);
    setSearchParams({});
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPaginationItems = () => {
    if (!paginatedData) return null;
    
    const { currentPage, totalPages } = paginatedData;
    const items = [];
    
    // Always show first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          onClick={() => handlePageChange(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Show ellipsis if there's a gap
    if (currentPage > 3) {
      items.push(<PaginationEllipsis key="ellipsis1" />);
    }

    // Show pages around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = start; i <= end; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if there's a gap
    if (currentPage < totalPages - 2) {
      items.push(<PaginationEllipsis key="ellipsis2" />);
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  // Show loading state for initial load
  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner size="lg" text="Loading shop..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-montserrat font-bold text-brand-black mb-4">
            Shop All Items
          </h1>
          <p className="text-gray-600">
            Discover amazing pre-loved items at unbeatable prices
          </p>
        </div>

        <ProductFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          condition={condition}
          setCondition={setCondition}
          brand={brand}
          setBrand={setBrand}
          categories={categories || []}
          onClearFilters={handleClearFilters}
        />

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {paginatedData?.totalCount || 0} items found
            {currentPage > 1 && ` (Page ${currentPage} of ${paginatedData?.totalPages || 1})`}
            {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}
          </p>
          {error && (
            <div className="text-red-600 text-sm">
              ⚠️ Error loading products
            </div>
          )}
        </div>

        <ProductGrid 
          products={paginatedData?.products || []} 
          isLoading={isLoading} 
          error={error}
        />

        {/* Pagination */}
        {paginatedData && paginatedData.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                {paginatedData.hasPreviousPage && (
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                    />
                  </PaginationItem>
                )}
                
                {renderPaginationItems()}
                
                {paginatedData.hasNextPage && (
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
