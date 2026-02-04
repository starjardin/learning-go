import { Plus, Image } from 'lucide-react';
import { useForm, type FieldValues } from 'react-hook-form';
import Button from './Button';
import { useGetCategoriesQuery } from '../apollo/generated/graphql';

interface ProductFormProps {
    onSubmit: (data: FieldValues) => void;
    isLoading: boolean;
}

export const ProductForm = ({ onSubmit, isLoading }: ProductFormProps) => {
    const { data: categoriesData } = useGetCategoriesQuery();
    const categories = categoriesData?.categories || [];

    const {
        register,
        handleSubmit,
    } = useForm();

    return (
        <form onSubmit={handleSubmit((data) => onSubmit(data))} className='space-y-6'>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                </label>
                <input
                    {...register('name', { required: true })}
                    type="text"
                    name="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter product name"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                </label>
                <textarea
                    {...register('description', { required: true })}
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
                        {...register('price', { required: true, min: 0 })}
                        min="0"
                        step="1"
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
                        {...register('availableStocks', { required: true, min: 0 })}
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
                        {...register('imageLink')}
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
                    {...register('category', { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.value}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <div className="flex items-center space-x-3">
                <input
                    type="checkbox"
                    {...register('isNegotiable')}
                    id="isNegotiable"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isNegotiable" className="text-sm font-medium text-gray-700">
                    Price is negotiable
                </label>
            </div>

            <Button
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
            </Button>
        </form>
    )
}