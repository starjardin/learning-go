import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCreateProductMutation } from '../apollo/generated/graphql';
import { ProductForm } from './ProductForm';
import type { FieldValues } from 'react-hook-form';

export const CreateProductScreen = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [createProduct] = useCreateProductMutation();

    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate('/signin');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (data: FieldValues) => {
        setIsLoading(true);
        setError(null);

        const {
            name, description, price, imageLink, availableStocks, isNegotiable, category
        } = data

        try {
            await createProduct({
                variables: {
                    input: {
                        name: name,
                        description: description,
                        price: price,
                        image_link: imageLink || 'https://via.placeholder.com/300x300',
                        available_stocks: availableStocks,
                        is_negotiable: isNegotiable,
                        company_id: 1, // Temporary static company_id for testing,
                        owner_id: 6, // Temporary static owner_id for testing
                        category: category,
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
            <div className="bg-white p-4 border-b flex items-center">
                <Link to="/products" className="mr-4">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-lg font-bold">Create Product</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                        <div className="flex items-center">
                            <X className="w-4 h-4 mr-2" />
                            {error}
                        </div>
                    </div>
                )}
                <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
        </div>
    );
};
