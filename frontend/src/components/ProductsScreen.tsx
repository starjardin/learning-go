import type { ProductFormData } from "../types";
import { ArrowLeft, Grid3X3, Heart, Home, Search, Filter, Plus, User, X, Image } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCreateProductMutation, useGetProductsQuery, useGetCategoriesQuery } from "../apollo/generated/graphql";

export const ProductsScreen = () => {
  const { data: productsData, loading, error } = useGetProductsQuery();
  const { data: categoriesData } = useGetCategoriesQuery();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    minStock: undefined as number | undefined,
    sold: false,
    sortBy: 'created_desc' as string,
  });
  const [showFab, setShowFab] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    availableStocks: 0,
    isNegotiable: false,
    imageLink: '',
    companyId: null,
    category: '',
  });
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const [createProduct] = useCreateProductMutation();
  const categories = categoriesData?.categories || [];

   useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowFab(scrollY > 200); // Show FAB after scrolling 200px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border rounded-lg p-3">
                <div className="w-full h-32 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded mb-1 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
            ))}
          </div>
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-600">Error: {error.message}</div>;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: searchQuery }));
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      minPrice: undefined,
      maxPrice: undefined,
      minStock: undefined,
      sold: false,
      sortBy: 'created_desc',
    });
    setSearchQuery('');
  };

  const handleCreateProduct = async () => {
    setCreateError(null);
    setIsCreating(true);

    try {
      createProduct({ variables: { input: {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        image_link: formData.imageLink || 'https://via.placeholder.com/300x300',
        available_stocks: formData.availableStocks,
        is_negotiable: formData.isNegotiable,
        company_id: formData.companyId,
        owner_id: 6, // Temporary static owner_id for testing
        category: formData.category,
      }}})
      // Product created successfully
      navigate('/products');
      setShowCreateModal(false)
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="bg-white p-4 border-b flex items-center">
        <Link to='/categories' className="mr-4">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-bold">All Products</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm font-medium">Create</span>
        </button>
      </div>

      <div className="p-4 border-b">
        <form onSubmit={handleSearch} className="flex space-x-2 mb-3">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
        </form>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {(filters.minPrice !== undefined || filters.maxPrice !== undefined || filters.minStock !== undefined) && (
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">Active</span>
            )}
          </button>

          <button
            onClick={clearFilters}
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            Clear All
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price ($)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price ($)</label>
                <input
                  type="number"
                  placeholder="1000"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minStock || ''}
                onChange={(e) => handleFilterChange('minStock', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="created_desc">Newest First</option>
                <option value="created_asc">Oldest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {(productsData?.getProducts ?? [])?.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Grid3X3 className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {(productsData?.getProducts ?? []).map((product: any) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white border rounded-lg p-3 text-left hover:shadow-md transition-shadow"
              >
                <img 
                  src={product.image_link || 'https://picsum.photos/200/300'} 
                  alt={product.name} 
                  className="w-full h-32 bg-gray-200 rounded-lg mb-2 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://picsum.photos/200/300';
                  }}
                />
                <h3 className="font-medium text-sm mb-1 line-clamp-1">{product.name}</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">
                    {product.available_stocks} in stock
                  </span>
                  {product.is_negotiable && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Negotiable
                    </span>
                  )}
                </div>
                <p className="text-lg font-bold text-blue-600">${product.price}</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-around bg-white border-t py-3 mt-auto">
        <button onClick={() => navigate('/categories')} className="flex flex-col items-center py-2">
          <Home className="w-6 h-6 mb-1" />
          <span className="text-xs">Home</span>
        </button>
        <button className="flex flex-col items-center py-2">
          <Grid3X3 className="w-6 h-6 mb-1" />
          <span className="text-xs">Categories</span>
        </button>
        <button className="flex flex-col items-center py-2">
          <Heart className="w-6 h-6 mb-1" />
          <span className="text-xs">Wishlist</span>
        </button>
        <button className="flex flex-col items-center py-2">
          <User className="w-6 h-6 mb-1" />
          <span className="text-xs">Profile</span>
        </button>
      </div>

      {showFab && (
        <button
          onClick={() => setShowCreateModal(true)}
          className="fixed bottom-20 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 z-50"
          aria-label="Create new product"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold">Create New Product</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {createError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  <div className="flex items-center">
                    <X className="w-4 h-4 mr-2" />
                    {createError}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your product"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Stock *
                    </label>
                    <input
                      type="number"
                      value={formData.availableStocks}
                      onChange={(e) => setFormData(prev => ({ ...prev, availableStocks: Number(e.target.value) }))}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <div className="flex items-center space-x-2">
                    <Image className="w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      value={formData.imageLink}
                      onChange={(e) => setFormData(prev => ({ ...prev, imageLink: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isNegotiable"
                    checked={formData.isNegotiable}
                    onChange={(e) => setFormData(prev => ({ ...prev, isNegotiable: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isNegotiable" className="text-sm font-medium text-gray-700">
                    Price is negotiable
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.value}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateProduct}
                  disabled={isCreating}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium disabled:bg-blue-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  {isCreating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Create Product
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
