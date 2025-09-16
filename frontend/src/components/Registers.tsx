import { ArrowLeft, Eye, EyeOff, Link, User } from "lucide-react";
import { useState } from "react";

 export const RegisterScreen = () => {


    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    });
    const [registerForm, setRegisterForm] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        full_name: '',
        address: '',
        phone_number: '',
        payment_method: ''
    });

    const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (registerForm.password !== registerForm.confirmPassword) {
        alert('Passwords do not match!');
        return;
        }
        
        if (Object.values(registerForm).every(field => field !== '')) {
        const hashedPassword = btoa(registerForm.password);
        
        console.log('Registration data:', {
            ...registerForm,
            hashed_password: hashedPassword,
            password: undefined,
            confirmPassword: undefined
        });
        
        alert('Registration successful!');
        
        } else {
            alert('Please fill in all required fields');
        }
    };

  const handleRegisterInputChange = (field: keyof typeof registerForm, value: string) => {
    setRegisterForm(prev => ({
      ...prev,
      [field]: value
    }));
  };


    return <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="bg-white pt-8 pb-4 px-6">
        <div className="flex items-center mb-6">
          <Link to="/login" className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="text-center flex-1">
            <div className="w-12 h-12 bg-black rounded-full mx-auto mb-3 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-black mb-1">Create Account</h1>
            <p className="text-gray-500 text-sm">Join ShopEasy today</p>
          </div>
        </div>
      </div>

      {/* Register Form */}
      <div className="flex-1 px-6 overflow-y-auto">
        <form onSubmit={handleRegister} className="space-y-4 pb-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={registerForm.username}
              onChange={(e) => handleRegisterInputChange('username', e.target.value)}
              placeholder="Choose a username"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={registerForm.full_name}
              onChange={(e) => handleRegisterInputChange('full_name', e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={registerForm.email}
              onChange={(e) => handleRegisterInputChange('email', e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={registerForm.phone_number}
              onChange={(e) => handleRegisterInputChange('phone_number', e.target.value)}
              placeholder="Enter your phone number"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              value={registerForm.address}
              onChange={(e) => handleRegisterInputChange('address', e.target.value)}
              placeholder="Enter your full address"
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none"
              required
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Payment Method <span className="text-red-500">*</span>
            </label>
            <select
              value={registerForm.payment_method}
              onChange={(e) => handleRegisterInputChange('payment_method', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              required
            >
              <option value="">Select payment method</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="paypal">PayPal</option>
              <option value="apple_pay">Apple Pay</option>
              <option value="google_pay">Google Pay</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={registerForm.password}
                onChange={(e) => handleRegisterInputChange('password', e.target.value)}
                placeholder="Create a password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all pr-12"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={registerForm.confirmPassword}
                onChange={(e) => handleRegisterInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm your password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-3 pt-2">
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 text-black bg-gray-100 border-gray-300 rounded focus:ring-black mt-1"
              required
            />
            <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
              I agree to the{' '}
              <button type="button" className="text-black font-medium hover:underline">
                Terms of Service
              </button>{' '}
              and{' '}
              <button type="button" className="text-black font-medium hover:underline">
                Privacy Policy
              </button>
            </label>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-lg font-medium text-lg hover:bg-gray-800 transition-colors mt-6"
          >
            Create Account
          </button>
        </form>
      </div>

      {/* Sign In Link */}
      <div className="p-6 text-center border-t border-gray-200">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link 
            to='/login'
            className="text-black font-medium hover:underline"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  };