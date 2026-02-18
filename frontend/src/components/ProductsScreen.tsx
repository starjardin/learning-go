import { ArrowLeft, Grid3X3, Search, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useGetProductsQuery, useGetCategoriesQuery } from "../apollo/generated/graphql";
import { Footer } from "./Footer";
import Button from "./Button";


export const ProductsScreen = () => {
    const { data: categoriesData } = useGetCategoriesQuery();
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryFromUrl = searchParams.get('category') || '';

    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        search: '',
        category: categoryFromUrl,
        sold: null as boolean | null,
        isNegotiable: null as boolean | null,
        minPrice: undefined as number | undefined,
        maxPrice: undefined as number | undefined,
        minStock: undefined as number | undefined,
        sortBy: 'created_desc' as string,
    });

    // Sync category filter with URL
    useEffect(() => {
        setFilters(prev => ({ ...prev, category: categoryFromUrl }));
    }, [categoryFromUrl]);

    const { data: productsData, loading, error } = useGetProductsQuery({
        variables: {
            search: filters.search || null,
            category: filters.category || null,
            sold: filters.sold,
            isNegotiable: filters.isNegotiable,
        },
        fetchPolicy: 'cache-and-network',
    });

    const navigate = useNavigate();

    const categories = categoriesData?.categories || [];

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
        if (key === 'category') {
            if (value) {
                setSearchParams({ category: value });
            } else {
                setSearchParams({});
            }
        }
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            category: '',
            sold: null,
            isNegotiable: null,
            minPrice: undefined,
            maxPrice: undefined,
            minStock: undefined,
            sortBy: 'created_desc',
        });
        setSearchQuery('');
        setSearchParams({});
    };

    return (
        <div className="flex flex-col h-screen bg-white">
            <div className="bg-white p-4 border-b flex items-center">
                <Link to='/categories' className="mr-4">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-lg font-bold">All Products</h1>
                <Button
                    onClick={() => navigate('/create-product')}
                    className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                    <Plus className="w-5 h-5" />
                    <span className="text-sm font-medium">Create</span>
                </Button>
            </div>

            <div className="p-4 border-b">
                <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3">
                    <div className="min-w-[200px] flex-1 relative">
                        <Search className="w-3 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <select
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.value}>{cat.name}</option>
                        ))}
                    </select>

                    <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white">
                        <span className="text-sm text-gray-600">Sold:</span>
                        <label className="flex items-center gap-1 cursor-pointer">
                            <input
                                type="radio"
                                name="sold"
                                checked={filters.sold === null}
                                onChange={() => handleFilterChange('sold', null)}
                                className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm">All</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                            <input
                                type="radio"
                                name="sold"
                                checked={filters.sold === true}
                                onChange={() => handleFilterChange('sold', true)}
                                className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm">Yes</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                            <input
                                type="radio"
                                name="sold"
                                checked={filters.sold === false}
                                onChange={() => handleFilterChange('sold', false)}
                                className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm">No</span>
                        </label>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white">
                        <span className="text-sm text-gray-600">Negotiable:</span>
                        <label className="flex items-center gap-1 cursor-pointer">
                            <input
                                type="radio"
                                name="isNegotiable"
                                checked={filters.isNegotiable === null}
                                onChange={() => handleFilterChange('isNegotiable', null)}
                                className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm">All</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                            <input
                                type="radio"
                                name="isNegotiable"
                                checked={filters.isNegotiable === true}
                                onChange={() => handleFilterChange('isNegotiable', true)}
                                className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm">Yes</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                            <input
                                type="radio"
                                name="isNegotiable"
                                checked={filters.isNegotiable === false}
                                onChange={() => handleFilterChange('isNegotiable', false)}
                                className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm">No</span>
                        </label>
                    </div>

                    <div className="flex justify-end flex-1">
                        <Button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Search
                    </Button>

                    <Button
                        type="button"
                        onClick={clearFilters}
                        className="text-gray-600 hover:text-gray-900 text-sm px-3 py-2"
                    >
                        Clear
                    </Button>
                    </div>
                </form>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {(productsData?.getProducts ?? [])?.length === 0 ? (
                    <div className="text-center py-12 max-w-2xl m-auto h-full flex flex-col justify-center">
                        <div className="text-gray-400 mb-4">
                            <Grid3X3 className="w-12 h-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
                        <Button
                            onClick={() => navigate('/create-product')}
                            className="flex items-center justify-center w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Create Your First Product
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {(productsData?.getProducts ?? []).map((product: any) => (
                            <Link
                                key={product.id}
                                to={`/products/${product.id}`}
                                className="bg-white border rounded-lg p-3 text-left hover:shadow-md transition-shadow"
                            >
                                <img
                                    src={product.image_link || 'https://picsum.photos/500/500'}
                                    alt={product.name}
                                    className="w-full h-32 bg-gray-200 rounded-lg mb-2 object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://picsum.photos/500/500';
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
            <Footer />
        </div>
    );
};
