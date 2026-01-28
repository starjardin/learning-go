import { ArrowLeft, Eye, EyeOff, User, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const RegisterScreen = () => {
    const navigate = useNavigate();
    const { register, isLoading, error, clearError, signupMessage, clearSignupMessage } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [registrationComplete, setRegistrationComplete] = useState(false);
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

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (registerForm.password !== registerForm.confirmPassword) {
            return; // Let user see password mismatch error
        }

        try {
            const userData = {
                username: registerForm.username,
                email: registerForm.email,
                password: registerForm.password,
                full_name: registerForm.full_name,
                address: registerForm.address,
                phone_number: registerForm.phone_number,
                payment_method: registerForm.payment_method,
            };

            const result = await register(userData);
            if (result) {
                // Show verification message instead of redirecting
                setRegistrationComplete(true);
            }
        } catch (error) {
            // Error is handled in AuthContext
            console.error('Registration failed:', error);
        }
    };

    const handleGoToLogin = () => {
        clearSignupMessage();
        navigate('/signin');
    };

    const handleRegisterInputChange = (field: keyof typeof registerForm, value: string) => {
        setRegisterForm(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear any existing error when user starts typing
        if (error) {
            clearError();
        }
    };

    const isFormValid = () => {
        return registerForm.email &&
            registerForm.username &&
            registerForm.password &&
            registerForm.full_name &&
            registerForm.address &&
            registerForm.phone_number &&
            registerForm.payment_method &&
            registerForm.password === registerForm.confirmPassword;
    };

    // Show verification message after successful registration
    if (registrationComplete && signupMessage) {
        return (
            <div className="flex flex-col w-lg m-auto h-screen bg-white">
                <div className="flex-1 flex flex-col items-center justify-center px-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <Mail className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-black mb-2 text-center">Check Your Email</h1>
                    <p className="text-gray-600 text-center mb-6">
                        {signupMessage}
                    </p>
                    <p className="text-gray-500 text-sm text-center mb-8">
                        We sent a verification link to <strong>{registerForm.email}</strong>.
                        Click the link in the email to verify your account.
                    </p>
                    <button
                        onClick={handleGoToLogin}
                        className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-lg m-auto h-screen bg-white">
            <div className="bg-white pt-8 pb-4 px-6">
                <div className="flex items-center mb-6">
                    <Link to="/signin" className="mr-4">
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

            <div className="flex-1 px-6 overflow-y-auto">
                <form onSubmit={handleRegister} className="space-y-4 pb-6">
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
                            disabled={isLoading}
                        />
                    </div>

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
                            disabled={isLoading}
                        />
                    </div>

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
                            disabled={isLoading}
                        />
                    </div>

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
                            disabled={isLoading}
                        />
                    </div>

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
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Preferred Payment Method <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={registerForm.payment_method}
                            onChange={(e) => handleRegisterInputChange('payment_method', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                            required
                            disabled={isLoading}
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
                                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all pr-12 ${registerForm.password && registerForm.confirmPassword && registerForm.password !== registerForm.confirmPassword ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                required
                                minLength={6}
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
                        <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
                    </div>

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
                                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all pr-12 ${registerForm.password && registerForm.confirmPassword && registerForm.password !== registerForm.confirmPassword ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                required
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {registerForm.password && registerForm.confirmPassword && registerForm.password !== registerForm.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                        )}
                    </div>

                    <div className="flex items-start space-x-3 pt-2">
                        <input
                            type="checkbox"
                            id="terms"
                            className="w-4 h-4 text-black bg-gray-100 border-gray-300 rounded focus:ring-black mt-1"
                            required
                        />
                        <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                            I agree to the{' '}
                            <button type="button" className="text-black cursor-pointer font-medium hover:underline">
                                Terms of Service
                            </button>{' '}
                            and{' '}
                            <button type="button" className="text-black cursor-pointer font-medium hover:underline">
                                Privacy Policy
                            </button>
                        </label>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !isFormValid()}
                        className="w-full bg-black cursor-pointer text-white py-4 rounded-lg font-medium text-lg hover:bg-gray-800 transition-colors mt-6 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Creating Account...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>
            </div>

            <div className="p-6 text-center border-t border-gray-200">
                <p className="text-gray-600">
                    Already have an account?{' '}
                    <Link
                        to='/signin'
                        className="text-black font-medium hover:underline"
                    >
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterScreen;