import { ArrowLeft, Eye, EyeOff, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import { useAuth } from "../contexts/AuthContext";

 export const LoginScreen = () => {
    const navigate = useNavigate();
    const { login, isLoading, error, clearError } = useAuth();
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (field: 'email' | 'password', value: string) => {
      setLoginForm(prev => ({
        ...prev,
        [field]: value
      }));
      // Clear any existing error when user starts typing
      if (error) {
        clearError();
      }
    };

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      try {
        await login(loginForm.email, loginForm.password);
        // Redirect to categories after successful login
        navigate('/categories');
      } catch (error) {
        // Error is handled in AuthContext
        console.error('Login failed:', error);
      }
    };

    return <div className="flex flex-col w-lg m-auto h-screen bg-white">
      <div className="bg-white pt-8 pb-4 px-6">
        <div className="flex items-center mb-6">
          <Link to="/register" className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="text-center flex-1">
            <div className="w-12 h-12 bg-black rounded-full mx-auto mb-3 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-black mb-1">Sign In</h1>
            <p className="text-gray-500 text-sm">Welcome back to ShopEasy</p>
          </div>
        </div>
      </div>
      <div className="flex-1 px-6">
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">
               Email Address
             </label>
             <input
               type="email"
               value={loginForm.email}
               onChange={(e) => handleInputChange('email', e.target.value)}
               placeholder="Enter your email"
               className={`w-full px-4 py-4 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all ${
                 error ? 'border-red-500' : 'border-gray-200'
               }`}
               required
               disabled={isLoading}
             />
           </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">
               Password
             </label>
             <div className="relative">
               <input
                 type={showPassword ? 'text' : 'password'}
                 value={loginForm.password}
                 onChange={(e) => handleInputChange('password', e.target.value)}
                 placeholder="Enter your password"
                 className={`w-full px-4 py-4 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all pr-12 ${
                   error ? 'border-red-500' : 'border-gray-200'
                 }`}
                 required
                 disabled={isLoading}
               />
               <button
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
               >
                 {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
               </button>
             </div>
           </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-black bg-gray-100 border-gray-300 rounded focus:ring-black"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <Button type="button" className="text-sm text-black font-medium hover:underline">
              Forgot Password?
            </Button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black cursor-pointer text-white py-4 rounded-lg font-medium text-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </form>
      </div>

      <div className="p-6 text-center border-t border-gray-200">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/register" 
            className="text-black font-medium hover:underline"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
}