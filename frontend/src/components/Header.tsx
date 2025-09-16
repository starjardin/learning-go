import { useState } from 'react';
import { ShoppingCart, Search, User, Home, Grid3X3, Heart, Star, Plus, Minus, ArrowLeft } from 'lucide-react';

const ShoppingApp = () => {
  const [currentScreen, setCurrentScreen] = useState('categories');
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Samsung Galaxy S22', price: 699.99, quantity: 1, image: '/api/placeholder/60/60' },
    { id: 2, name: 'iPhone 14', price: 899.99, quantity: 2, image: '/api/placeholder/60/60' }
  ]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categories = [
    { id: 1, name: 'Clothing', icon: '👕', count: 156 },
    { id: 2, name: 'Electronics', icon: '📱', count: 89 },
    { id: 3, name: 'Accessories', icon: '👜', count: 234 },
    { id: 4, name: 'Home & Garden', icon: '🏠', count: 67 },
    { id: 5, name: 'Sports', icon: '⚽', count: 123 },
    { id: 6, name: 'Books', icon: '📚', count: 345 }
  ];

  const products = [
    { id: 1, name: 'Red T-Shirt', price: 24.99, rating: 4.5, image: '/api/placeholder/150/150', category: 'Clothing' },
    { id: 2, name: 'Blue Jeans', price: 59.99, rating: 4.2, image: '/api/placeholder/150/150', category: 'Clothing' },
    { id: 3, name: 'Samsung Phone', price: 699.99, rating: 4.7, image: '/api/placeholder/150/150', category: 'Electronics' },
    { id: 4, name: 'Leather Bag', price: 89.99, rating: 4.3, image: '/api/placeholder/150/150', category: 'Accessories' },
    { id: 5, name: 'Running Shoes', price: 129.99, rating: 4.6, image: '/api/placeholder/150/150', category: 'Sports' },
    { id: 6, name: 'Coffee Mug', price: 14.99, rating: 4.1, image: '/api/placeholder/150/150', category: 'Home & Garden' }
  ];

  const updateQuantity = (id, change) => {
    setCartItems(items => items.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(0, item.quantity + change) }
        : item
    ).filter(item => item.quantity > 0));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const CartScreen = () => (
    <div className="flex flex-col h-screen bg-white">
      <div className="bg-black text-white p-4 flex items-center justify-between">
        <button onClick={() => setCurrentScreen('categories')}>
          <ArrowLeft className="w-6 h-6" />
        </button>
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
  );

  const CategoriesScreen = () => (
    <div className="flex flex-col h-screen bg-white">
      <div className="bg-white p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-black rounded-full mr-3"></div>
            <div>
              <p className="text-sm text-gray-500">Welcome to</p>
              <p className="font-bold text-black">ShopEasy</p>
            </div>
          </div>
          <button 
            onClick={() => setCurrentScreen('cart')}
            className="relative"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
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
        <div className="grid grid-cols-2 gap-4">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setCurrentScreen('products')}
              className="bg-gray-50 p-6 rounded-xl text-center hover:bg-gray-100 transition-colors"
            >
              <div className="text-3xl mb-2">{category.icon}</div>
              <h3 className="font-medium text-gray-800 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.count} products</p>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-3">Featured Products</h3>
        <div className="grid grid-cols-2 gap-4">
          {products.slice(0, 4).map(product => (
            <div key={product.id} className="bg-white border rounded-lg p-3">
              <img src={product.image} alt={product.name} className="w-full h-32 bg-gray-200 rounded-lg mb-2" />
              <h4 className="font-medium text-sm mb-1">{product.name}</h4>
              <p className="text-lg font-bold">${product.price}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-around bg-white border-t py-3 mt-auto">
        <button className="flex flex-col items-center py-2">
          <Home className="w-6 h-6 mb-1" />
          <span className="text-xs">Home</span>
        </button>
        <button 
          onClick={() => setCurrentScreen('categories')}
          className="flex flex-col items-center py-2"
        >
          <Grid3X3 className="w-6 h-6 mb-1 text-black" />
          <span className="text-xs text-black font-medium">Categories</span>
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
    </div>
  );

  const ProductsScreen = () => (
    <div className="flex flex-col h-screen bg-white">
      <div className="bg-white p-4 border-b flex items-center">
        <button onClick={() => setCurrentScreen('categories')} className="mr-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">All Products</h1>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Shop All Products</h2>
          <button className="text-blue-600 font-medium">View All</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {products.map(product => (
            <button
              key={product.id}
              onClick={() => {
                setSelectedProduct(product);
                setCurrentScreen('productDetail');
              }}
              className="bg-white border rounded-lg p-3 text-left"
            >
              <img src={product.image} alt={product.name} className="w-full h-32 bg-gray-200 rounded-lg mb-2" />
              <h3 className="font-medium text-sm mb-1">{product.name}</h3>
              <div className="flex items-center mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
              </div>
              <p className="text-lg font-bold">${product.price}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-around bg-white border-t py-3 mt-auto">
        <button className="flex flex-col items-center py-2">
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
    </div>
  );

  const ProductDetailScreen = () => (
    <div className="flex flex-col h-screen bg-white">
      <div className="bg-white p-4 border-b flex items-center justify-between">
        <button onClick={() => setCurrentScreen('products')}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">Product Details</h1>
        <button>
          <Heart className="w-6 h-6" />
        </button>
      </div>

      {selectedProduct && (
        <div className="flex-1">
          <div className="p-4">
            <img 
              src={selectedProduct.image} 
              alt={selectedProduct.name} 
              className="w-full h-64 bg-gray-200 rounded-lg mb-4" 
            />
            
            <h1 className="text-2xl font-bold mb-2">{selectedProduct.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(selectedProduct.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">({selectedProduct.rating}) • 127 reviews</span>
            </div>

            <p className="text-3xl font-bold text-black mb-4">${selectedProduct.price}</p>

            <div className="mb-6">
              <h3 className="font-bold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                This is a high-quality {selectedProduct.name.toLowerCase()} that offers excellent value for money. 
                Perfect for everyday use with premium materials and craftsmanship.
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
      )}

      <div className="p-4 bg-white border-t">
        <div className="flex gap-3">
          <button className="flex-1 bg-gray-100 text-black py-4 rounded-lg font-medium">
            Add to Wishlist
          </button>
          <button 
            className="flex-1 bg-black text-white py-4 rounded-lg font-medium"
            onClick={() => {
              // Add to cart logic would go here
              setCurrentScreen('cart');
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

  const renderScreen = () => {
    switch(currentScreen) {
      case 'cart':
        return <CartScreen />;
      case 'products':
        return <ProductsScreen />;
      case 'productDetail':
        return <ProductDetailScreen />;
      default:
        return <CategoriesScreen />;
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen">
      {renderScreen()}
    </div>
  );
};

export default ShoppingApp;