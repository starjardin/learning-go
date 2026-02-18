import { ArrowLeft, Heart, Star, ShoppingCart, Check, AlertCircle, X, Download, ZoomIn } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useGetProductQuery, useAddToCartMutation } from "../apollo/generated/graphql";
import { useState } from "react";
import Button from "./Button";

export const ProductDetailScreen = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [authError, setAuthError] = useState(false);
    const [imageExpanded, setImageExpanded] = useState(false);

    const { data, loading, error } = useGetProductQuery({
        variables: { id: id as string },
        skip: !id,
    });

    const [addToCartMutation] = useAddToCartMutation();

    const product = data?.getProduct;
    const isAuthenticated = !!localStorage.getItem('token');

    const imageUrl = product?.image_link || 'https://picsum.photos/500/500';

    const handleDownloadImage = async () => {
        try {
            const response = await fetch(imageUrl, { mode: 'cors' });
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${product?.name || 'product'}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch {
            window.open(imageUrl, '_blank');
        }
    };

    const handleAddToCart = async () => {
        if (!id || !product || product.available_stocks === 0) return;

        if (!isAuthenticated) {
            setAuthError(true);
            return;
        }

        setIsAdding(true);
        setAuthError(false);
        try {
            await addToCartMutation({
                variables: { productId: id, quantity },
            });
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
        } catch (err: any) {
            console.error('Failed to add to cart:', err);
            if (err?.message?.includes('authentication')) {
                setAuthError(true);
            }
        } finally {
            setIsAdding(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col h-screen bg-white">
                <div className="bg-white p-4 border-b flex items-center justify-between">
                    <Link to='/products'>
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-lg font-bold">Product Details</h1>
                    <Button>
                        <Heart className="w-6 h-6" />
                    </Button>
                </div>
                <div className="flex-1 p-4">
                    <div className="w-full h-64 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex flex-col h-screen bg-white">
                <div className="bg-white p-4 border-b flex items-center justify-between">
                    <Link to='/products'>
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-lg font-bold">Product Details</h1>
                    <Button>
                        <Heart className="w-6 h-6" />
                    </Button>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-red-500">{error?.message || "Product not found"}</p>
                </div>
            </div>
        );
    }

    return <div className="flex flex-col h-screen bg-white max-w-7xl mx-auto">
        {/* Full-screen image modal */}
        {imageExpanded && (
            <div
                className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
                onClick={() => setImageExpanded(false)}
            >
                <div className="absolute top-4 right-4 flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadImage();
                        }}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                        title="Download image"
                    >
                        <Download className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => setImageExpanded(false)}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                        title="Close"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain p-4"
                    onClick={(e) => e.stopPropagation()}
                    onError={(e) => {
                        e.currentTarget.src = 'https://picsum.photos/500/500';
                    }}
                />
            </div>
        )}

        <div className="bg-white p-4 border-b flex items-center justify-between">
            <Link to='/products'>
                <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-lg font-bold">Product Details</h1>
            <Button>
                <Heart className="w-6 h-6" />
            </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
            <div className="p-4">
                <div className="relative group cursor-pointer" onClick={() => setImageExpanded(true)}>
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-64 bg-gray-200 rounded-lg mb-4 object-cover"
                        onError={(e) => {
                            e.currentTarget.src = 'https://picsum.photos/500/500';
                        }}
                    />
                    <div className="absolute inset-0 mb-4 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors flex items-center justify-center">
                        <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{product.category}</span>
                    {product.is_negotiable && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Negotiable</span>
                    )}
                </div>

                <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

                <div className="flex items-center mb-4">
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                        ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">(4.0) • 127 reviews</span>
                </div>

                <p className="text-3xl font-bold text-black mb-4">${product.price}</p>

                <div className="mb-4">
                    <span className="text-sm text-gray-500">
                        {product.available_stocks > 0 ? `${product.available_stocks} in stock` : 'Out of stock'}
                    </span>
                </div>

                <div className="mb-6">
                    <h3 className="font-bold mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed">
                        {product.description}
                    </p>
                </div>

                <div className="mb-6">
                    <h3 className="font-bold mb-2">Reviews</h3>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center mb-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-full mr-3"></div>
                            <div>
                                <p className="font-medium text-sm">Sarah Johnson</p>
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">Great quality product! Highly recommend.</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="p-4 bg-white border-t">
            <div className="flex items-center gap-3 mb-3">
                <span className="text-sm text-gray-600">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                    <Button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="px-3 py-2 text-lg font-medium hover:bg-gray-100"
                        disabled={quantity <= 1}
                    >
                        -
                    </Button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <Button
                        onClick={() => setQuantity(q => Math.min(product?.available_stocks || 10, q + 1))}
                        className="px-3 py-2 text-lg font-medium hover:bg-gray-100"
                        disabled={quantity >= (product?.available_stocks || 10)}
                    >
                        +
                    </Button>
                </div>
            </div>
            <div className="flex gap-3">
                <Button className="flex-1 bg-gray-100 text-black py-4 rounded-lg font-medium flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5" />
                    Wishlist
                </Button>
                <Button
                    onClick={handleAddToCart}
                    disabled={isAdding || product?.available_stocks === 0}
                    className={`flex-1 py-4 rounded-lg font-medium text-center flex items-center justify-center gap-2 transition-colors ${addedToCart
                        ? 'bg-green-600 text-white'
                        : 'bg-black text-white hover:bg-gray-800'
                        } disabled:bg-gray-400 disabled:cursor-not-allowed`}
                >
                    {isAdding ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Adding...
                        </>
                    ) : addedToCart ? (
                        <>
                            <Check className="w-5 h-5" />
                            Added!
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="w-5 h-5" />
                            Add to Cart
                        </>
                    )}
                </Button>
            </div>
            {authError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span className="text-red-700 text-sm">Please sign in to add items to cart</span>
                    <Button
                        onClick={() => navigate('/signin')}
                        className="ml-auto text-sm font-medium text-red-700 underline hover:text-red-800"
                    >
                        Sign In
                    </Button>
                </div>
            )}
            {addedToCart && (
                <Button
                    onClick={() => navigate('/cart')}
                    className="w-full mt-3 py-3 border-2 border-black text-black rounded-lg font-medium hover:bg-gray-50"
                >
                    View Cart
                </Button>
            )}
        </div>
    </div>
}