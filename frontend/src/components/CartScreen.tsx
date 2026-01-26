import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetCartQuery, useUpdateCartItemQuantityMutation, useRemoveFromCartMutation, useClearCartMutation } from "../apollo/generated/graphql";

export const CartScreen = () => {
    const { data, loading, error, refetch } = useGetCartQuery();
    const [updateQuantity] = useUpdateCartItemQuantityMutation();
    const [removeFromCart] = useRemoveFromCartMutation();
    const [clearCart] = useClearCartMutation();

    const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            await removeFromCart({ variables: { productId: String(productId) } });
        } else {
            await updateQuantity({ variables: { productId: String(productId), quantity: newQuantity } });
        }
        refetch();
    };

    const handleClearCart = async () => {
        await clearCart();
        refetch();
    };

    if (loading) {
        return (
            <div className="flex flex-col h-screen bg-white">
                <div className="bg-black text-white p-4 flex items-center justify-between">
                    <Link to='/categories'>
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-lg font-medium">Cart</h1>
                    <div className="w-6" />
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col h-screen bg-white">
                <div className="bg-black text-white p-4 flex items-center justify-between">
                    <Link to='/categories'>
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-lg font-medium">Cart</h1>
                    <div className="w-6" />
                </div>
                <div className="flex-1 flex items-center justify-center text-red-500">
                    {error.message.includes("not authenticated") ? (
                        <div className="text-center">
                            <p className="mb-4">Please sign in to view your cart</p>
                            <Link to="/signin" className="bg-black text-white px-6 py-2 rounded-lg">
                                Sign In
                            </Link>
                        </div>
                    ) : (
                        <p>Error loading cart: {error.message}</p>
                    )}
                </div>
            </div>
        );
    }

    const cart = data?.getCart;
    const items = cart?.items || [];

    return (
        <div className="flex flex-col h-screen bg-white">
            <div className="bg-black text-white p-4 flex items-center justify-between">
                <Link to='/categories'>
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-lg font-medium">Cart ({cart?.total_items || 0})</h1>
                {items.length > 0 && (
                    <button onClick={handleClearCart} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-5 h-5" />
                    </button>
                )}
                {items.length === 0 && <div className="w-6" />}
            </div>
      
            <div className="flex-1 p-4 overflow-auto">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <ShoppingCart className="w-16 h-16 mb-4" />
                        <p className="text-lg mb-4">Your cart is empty</p>
                        <Link to="/products" className="bg-black text-white px-6 py-3 rounded-lg">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    items.map(item => (
                        <div key={item.id} className="flex items-center bg-gray-50 p-4 rounded-lg mb-3">
                            <img 
                                src={item.product?.image_link?.[0] || '/api/placeholder/60/60'} 
                                alt={item.product?.name || 'Product'} 
                                className="w-16 h-16 rounded-lg bg-gray-200 object-cover" 
                            />
                            <div className="flex-1 ml-3">
                                <h3 className="font-medium text-gray-800">{item.product?.name}</h3>
                                <p className="text-lg font-bold text-black">${item.product?.price?.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center">
                                <button 
                                    onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="mx-3 font-medium">{item.quantity}</span>
                                <button 
                                    onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                                    className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {items.length > 0 && (
                <div className="p-4 border-t">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-medium">Total</span>
                        <span className="text-2xl font-bold">${cart?.total_price?.toFixed(2)}</span>
                    </div>
                    <button className="w-full bg-black text-white py-4 rounded-lg font-medium text-lg hover:bg-gray-800">
                        Checkout
                    </button>
                </div>
            )}
        </div>
    );
}