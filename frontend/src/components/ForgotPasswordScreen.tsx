import { ArrowLeft, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import { useForgotPasswordMutation } from "../apollo/generated/graphql";

export const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [forgotPassword, { loading }] = useForgotPasswordMutation();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        try {
            await forgotPassword({ variables: { email } });
            setSubmitted(true);
        } catch (err) {
            setError('Something went wrong. Please try again.');
        }
    };

    if (submitted) {
        return (
            <div className="flex flex-col w-lg m-auto h-screen bg-white">
                <div className="bg-white pt-8 pb-4 px-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <Mail className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-black mb-2">Check your email</h1>
                        <p className="text-gray-500 text-sm mb-6">
                            If an account exists for <strong>{email}</strong>, we've sent a password reset link.
                        </p>
                        <p className="text-gray-400 text-xs mb-8">
                            The link will expire in 1 hour. Check your spam folder if you don't see it.
                        </p>
                        <Link
                            to="/signin"
                            className="inline-block bg-black text-white py-3 px-8 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                        >
                            Back to Sign In
                        </Link>
                    </div>
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
                            <Mail className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-black mb-1">Forgot Password</h1>
                        <p className="text-gray-500 text-sm">Enter your email and we'll send you a reset link</p>
                    </div>
                </div>
            </div>
            <div className="flex-1 px-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (error) setError(null);
                            }}
                            placeholder="Enter your email"
                            className={`w-full px-4 py-4 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all ${error ? 'border-red-500' : 'border-gray-200'}`}
                            required
                            disabled={loading}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black cursor-pointer text-white py-4 rounded-lg font-medium text-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Sending...
                            </>
                        ) : (
                            'Send Reset Link'
                        )}
                    </Button>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}
                </form>
            </div>

            <div className="p-6 text-center border-t border-gray-200">
                <p className="text-gray-600">
                    Remember your password?{' '}
                    <Link to="/signin" className="text-black font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};
