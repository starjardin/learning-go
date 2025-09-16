import { ArrowLeft, Heart, Link, Star } from "lucide-react";
import { useState } from "react";
import type { products } from "../data/products";




export const ProductDetailScreen = () => {

    const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);

    return <div className="flex flex-col h-screen bg-white">
      <div className="bg-white p-4 border-b flex items-center justify-between">
        <Link to='products'>
          <ArrowLeft className="w-6 h-6" />
        </Link>
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
          <Link 
            className="flex-1 bg-black text-white py-4 rounded-lg font-medium"
            to='cart'
          >
            Add to Cart
          </Link>
        </div>
      </div>
    </div>
  }