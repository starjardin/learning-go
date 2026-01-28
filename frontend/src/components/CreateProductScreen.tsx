import type { ProductFormData } from '../types';

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, X, Image } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCreateProductMutation, useGetCategoriesQuery } from '../apollo/generated/graphql';

export const CreateProductScreen = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { data: categoriesData } = useGetCategoriesQuery();
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

    const [createProduct] = useCreateProductMutation();

    const categories = categoriesData?.categories || [];

    // Redirect if not authenticated
    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate('/signin');
        }
    }, [isAuthenticated, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                type === 'number' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await createProduct({
                variables: {
                    input: {
                        name: formData.name,
                        description: formData.description,
                        price: formData.price,
                        image_link: formData.imageLink || 'https://via.placeholder.com/300x300',
                        available_stocks: formData.availableStocks,
                        is_negotiable: formData.isNegotiable,
                        company_id: formData.companyId,
                        owner_id: 6, // Temporary static owner_id for testing
                        category: formData.category,
                    }
                },
                refetchQueries: ['getProducts'],
                awaitRefetchQueries: true,
            });
            // Product created successfully
            navigate('/products');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create product');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated) {
        return null; // Will redirect
    }

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* Header */}
            <div className="bg-white p-4 border-b flex items-center">
                <Link to="/products" className="mr-4">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-lg font-bold">Create Product</h1>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                        <div className="flex items-center">
                            <X className="w-4 h-4 mr-2" />
                            {error}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Product Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter product name"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Describe your product"
                        />
                    </div>

                    {/* Price and Stock */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price ($) *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
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
                                name="availableStocks"
                                value={formData.availableStocks}
                                onChange={handleInputChange}
                                required
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Image Link */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image URL
                        </label>
                        <div className="flex items-center space-x-2">
                            <Image className="w-5 h-5 text-gray-400" />
                            <input
                                type="url"
                                name="imageLink"
                                value={formData.imageLink}
                                onChange={handleInputChange}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
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

                    {/* Negotiable */}
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            name="isNegotiable"
                            id="isNegotiable"
                            checked={formData.isNegotiable}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="isNegotiable" className="text-sm font-medium text-gray-700">
                            Price is negotiable
                        </label>
                    </div>


                    {/* Company ID (if applicable) */}
                    {/* {(user as any).company_id && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company ID
              </label>
              <input
                name="companyId"
                value={formData.companyId || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Company ID (optional)"
              />
            </div>
          )} */}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium disabled:bg-blue-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Creating Product...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center">
                                <Plus className="w-5 h-5 mr-2" />
                                Create Product
                            </span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
