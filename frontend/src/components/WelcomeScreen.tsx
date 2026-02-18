import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Grid3x3, Package } from 'lucide-react';
import Button from './Button';

export const WelcomeScreen: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleBrowseProducts = () => {
        navigate('/products');
    };

    const handleViewCategories = () => {
        navigate('/categories');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Welcome Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    {/* User Icon */}
                    <div className="w-20 h-20 bg-black rounded-full mx-auto mb-6 flex items-center justify-center">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                            <span className="text-black font-bold text-lg">
                                {user?.username?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* Welcome Message */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome, {user?.full_name}!
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Your account has been created successfully. Start exploring our amazing products now!
                    </p>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        <Button
                            onClick={handleBrowseProducts}
                            className="w-full bg-black text-white py-4 px-6 rounded-lg font-medium text-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-3"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            <span>Browse Products</span>
                        </Button>

                        <Button
                            onClick={handleViewCategories}
                            className="w-full bg-gray-100 text-gray-900 py-4 px-6 rounded-lg font-medium text-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-3"
                        >
                            <Grid3x3 className="w-5 h-5" />
                            <span>View Categories</span>
                        </Button>

                        <Button
                            onClick={handleBrowseProducts}
                            className="w-full border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-lg font-medium text-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-3"
                        >
                            <Package className="w-5 h-5" />
                            <span>View All Items</span>
                        </Button>
                    </div>

                    {/* User Info */}
                    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                            <strong>Account Info:</strong><br />
                            Email: {user?.email}<br />
                            Username: {user?.username}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-gray-500 text-sm">
                        Ready to start shopping? Your journey begins now!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;