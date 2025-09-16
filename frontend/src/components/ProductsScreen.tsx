import { ArrowLeft, Grid3X3, Heart, Home, Link, Star, User } from "lucide-react";
import { useState } from "react";


const products = [
    { id: 1, name: 'Red T-Shirt', price: 24.99, rating: 4.5, image: '/api/placeholder/150/150', category: 'Clothing' },
    { id: 2, name: 'Blue Jeans', price: 59.99, rating: 4.2, image: '/api/placeholder/150/150', category: 'Clothing' },
    { id: 3, name: 'Samsung Phone', price: 699.99, rating: 4.7, image: '/api/placeholder/150/150', category: 'Electronics' },
    { id: 4, name: 'Leather Bag', price: 89.99, rating: 4.3, image: '/api/placeholder/150/150', category: 'Accessories' },
    { id: 5, name: 'Running Shoes', price: 129.99, rating: 4.6, image: '/api/placeholder/150/150', category: 'Sports' },
    { id: 6, name: 'Coffee Mug', price: 14.99, rating: 4.1, image: '/api/placeholder/150/150', category: 'Home & Garden' }
];

export const ProductsScreen = () => {
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);

  return  <div className="flex flex-col h-screen bg-white">
      <div className="bg-white p-4 border-b flex items-center">
        <Link to='categories' className="mr-4">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-bold">All Products</h1>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Shop All Products</h2>
          <button className="text-blue-600 font-medium">View All</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {products.map(product => (
            <Link
              key={product.id}
              onClick={() => {
                setSelectedProduct(product);
            }}
           to='productDetail'
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
            </Link>
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
}