import { Grid3X3, Heart, Home, Search, ShoppingCart, User, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGetCategoriesQuery, useGetProductsQuery } from "../apollo/generated/graphql";

const categoryIcons: Record<string, string> = {
    CLOTHING: '👕',
    ELECTRONICS: '📱',
    ACCESSORIES: '👜',
    HOME_AND_GARDEN: '🏠',
    SPORTS: '⚽',
    BOOKS: '📚',
};

export const CategoriesScreen = () => {
    const navigate = useNavigate();
    const { data, loading, error } = useGetCategoriesQuery();
    const { data: productsData } = useGetProductsQuery({
        variables: { sold: false }
    });

    const [cartItems] = useState([
        { id: 1, name: 'Samsung Galaxy S22', price: 699.99, quantity: 1, image: '/api/placeholder/60/60' },
        { id: 2, name: 'iPhone 14', price: 899.99, quantity: 2, image: '/api/placeholder/60/60' }
    ]);

    const categories = data?.categories || [];
    const products = productsData?.getProducts || [];


    return <div className="flex flex-col h-screen bg-white">
        <div className="bg-white p-4 border-b">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-black rounded-full mr-3"></div>
                    <div>
                        <p className="text-sm text-gray-500">Welcome to</p>
                        <p className="font-bold text-black">ShopEasy</p>
                    </div>
                </div>
                <Link
                    to='cart'
                    className="relative"
                >
                    <ShoppingCart className="w-6 h-6" />
                    {cartItems.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                        </span>
                    )}
                </Link>
                <button
                    onClick={() => navigate('/create-product')}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                    <Plus className="w-5 h-5" />
                    <span>Create</span>
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg"
                />
            </div>
        </div>

        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Categories</h2>
            {loading && <p className="text-gray-500">Loading categories...</p>}
            {error && <p className="text-red-500">Error loading categories: {error.message}</p>}
            <div className="grid grid-cols-2 gap-4">
                {categories.map(category => (
                    <Link
                        key={category.id}
                        to={`/products?category=${category.value}`}
                        className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                        <div className="text-3xl mb-2">{categoryIcons[category.value] || '📦'}</div>
                        <h3 className="font-medium text-gray-800 mb-1">{category.name}</h3>
                    </Link>
                ))}
            </div>
        </div>

        <div className="p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg">Featured Products</h3>
                <Link to="/products" className="text-blue-600 text-sm hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {products.slice(0, 4).map(product => (
                    <Link key={product.id} to={`/products/${product.id}`} className="bg-white border rounded-lg p-3 hover:shadow-md transition-shadow">
                        <img src={product.image_link} alt={product.name} className="w-full h-32 bg-gray-200 rounded-lg mb-2 object-cover" />
                        <h4 className="font-medium text-sm mb-1">{product.name}</h4>
                        <p className="text-lg font-bold">${product.price}</p>
                    </Link>
                ))}
            </div>
        </div>

        <div className="flex justify-around bg-white border-t py-3 mt-auto">
            <button className="flex flex-col items-center py-2">
                <Home className="w-6 h-6 mb-1" />
                <span className="text-xs">Home</span>
            </button>
            <Link
                to='categories'
                className="flex flex-col items-center py-2"
            >
                <Grid3X3 className="w-6 h-6 mb-1 text-black" />
                <span className="text-xs text-black font-medium">Categories</span>
            </Link>
            <button className="flex flex-col items-center py-2">
                <Heart className="w-6 h-6 mb-1" />
                <span className="text-xs">Wishlist</span>
            </button>
            <button className="flex flex-col items-center py-2">
                <User className="w-6 h-6 mb-1" />
                <span className="text-xs">Profile</span>
            </button>
        </div>
    </div>
}