import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Button from "./Button";
import { useResetPasswordMutation } from "../apollo/generated/graphql";

export const ResetPasswordScreen = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token') || '';

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [resetPassword, { loading }] = useResetPasswordMutation();

    if (!token) {
        return (
            <div className="flex flex-col w-lg m-auto h-screen bg-white items-center justify-center px-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-black mb-2">Invalid Reset Link</h1>
                    <p className="text-gray-500 mb-6">This password reset link is invalid or has expired.</p>
                    <Link
                        to="/forgot-password"
                        className="inline-block bg-black text-white py-3 px-8 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                        Request a new link
                    </Link>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="flex flex-col w-lg m-auto h-screen bg-white items-center justify-center px-6">
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-black mb-2">Password Reset!</h1>
                    <p className="text-gray-500 mb-6">Your password has been successfully reset.</p>
                    <Button
                        onClick={() => navigate('/signin')}
                        className="inline-block bg-black text-white py-3 px-8 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                        Sign In
                    </Button>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const result = await resetPassword({
                variables: { token, newPassword },
            });

            if (result.data?.resetPassword) {
                setSuccess(true);
            } else {
                setError('Failed to reset password. The link may have expired.');
            }
        } catch (err) {
            setError('Invalid or expired reset link. Please request a new one.');
        }
    };

    return (
        <div className="flex flex-col w-lg m-auto h-screen bg-white">
            <div className="bg-white pt-8 pb-4 px-6">
                <div className="flex items-center mb-6">
                    <Link to="/signin" className="mr-4">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div className="text-center flex-1">
                        <div className="w-12 h-12 bg-black rounded-full mx-auto mb-3 flex items-center justify-center">
                            <Lock className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-black mb-1">Reset Password</h1>
                        <p className="text-gray-500 text-sm">Enter your new password below</p>
                    </div>
                </div>
            </div>
            <div className="flex-1 px-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    if (error) setError(null);
                                }}
                                placeholder="Enter new password"
                                className={`w-full px-4 py-4 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all pr-12 ${error ? 'border-red-500' : 'border-gray-200'}`}
                                required
                                disabled={loading}
                                minLength={8}
                            />
                            <Button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </Button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    if (error) setError(null);
                                }}
                                placeholder="Confirm new password"
                                className={`w-full px-4 py-4 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all pr-12 ${error ? 'border-red-500' : 'border-gray-200'}`}
                                required
                                disabled={loading}
                                minLength={8}
                            />
                            <Button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </Button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black cursor-pointer text-white py-4 rounded-lg font-medium text-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Resetting...
                            </>
                        ) : (
                            'Reset Password'
                        )}
                    </Button>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};
