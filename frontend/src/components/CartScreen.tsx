import { ArrowLeft, Link, Minus, Plus } from "lucide-react";
import { useState } from "react";

 export const CartScreen = () => {


    const [cartItems, setCartItems] = useState([
        { id: 1, name: 'Samsung Galaxy S22', price: 699.99, quantity: 1, image: '/api/placeholder/60/60' },
        { id: 2, name: 'iPhone 14', price: 899.99, quantity: 2, image: '/api/placeholder/60/60' }
    ]);

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    const updateQuantity = (id: number, change: number) => {
        setCartItems(items => items.map(item => 
        item.id === id 
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        ).filter(item => item.quantity > 0));
    };

   return <div className="flex flex-col h-screen bg-white">
      <div className="bg-black text-white p-4 flex items-center justify-between">
        <Link to='/categories'>
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-medium">Cart</h1>
        <div className="w-6" />
      </div>
      
      <div className="flex-1 p-4">
        {cartItems.map(item => (
          <div key={item.id} className="flex items-center bg-gray-50 p-4 rounded-lg mb-3">
            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg bg-gray-200" />
            <div className="flex-1 ml-3">
              <h3 className="font-medium text-gray-800">{item.name}</h3>
              <p className="text-lg font-bold text-black">${item.price}</p>
            </div>
            <div className="flex items-center">
              <button 
                onClick={() => updateQuantity(item.id, -1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="mx-3 font-medium">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, 1)}
                className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium">Total</span>
          <span className="text-2xl font-bold">${getTotalPrice()}</span>
        </div>
        <button className="w-full bg-black text-white py-4 rounded-lg font-medium text-lg">
          Checkout
        </button>
      </div>
    </div>
}