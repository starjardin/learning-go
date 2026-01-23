import { ArrowLeft, Heart, Star } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useGetProductQuery } from "../apollo/generated/graphql";

export const ProductDetailScreen = () => {
    const { id } = useParams<{ id: string }>();
    const { data, loading, error } = useGetProductQuery({
      variables: { id: id as string },
      skip: !id,
    });

    const product = data?.getProduct;

    if (loading) {
      return (
        <div className="flex flex-col h-screen bg-white">
          <div className="bg-white p-4 border-b flex items-center justify-between">
            <Link to='/products'>
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-lg font-bold">Product Details</h1>
            <button>
              <Heart className="w-6 h-6" />
            </button>
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
            <button>
              <Heart className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-red-500">{error?.message || "Product not found"}</p>
          </div>
        </div>
      );
    }

    return <div className="flex flex-col h-screen bg-white">
      <div className="bg-white p-4 border-b flex items-center justify-between">
        <Link to='/products'>
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-bold">Product Details</h1>
        <button>
          <Heart className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <img 
            src={product.image_link} 
            alt={product.name} 
            className="w-full h-64 bg-gray-200 rounded-lg mb-4 object-cover" 
          />
          
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
        <div className="flex gap-3">
          <button className="flex-1 bg-gray-100 text-black py-4 rounded-lg font-medium">
            Add to Wishlist
          </button>
          <Link 
            className="flex-1 bg-black text-white py-4 rounded-lg font-medium text-center"
            to='/cart'
          >
            Add to Cart
          </Link>
        </div>
      </div>
    </div>
  }