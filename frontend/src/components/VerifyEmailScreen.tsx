import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Button from "./Button";
import { useVerifyEmailMutation } from "../apollo/generated/graphql";
import { useAuth } from "../contexts/AuthContext";

export const VerifyEmailScreen = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token') || '';

    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [errorMessage, setErrorMessage] = useState('');
    const hasVerified = useRef(false);

    const [verifyEmail] = useVerifyEmailMutation();
    const { login } = useAuth();

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setErrorMessage('Invalid verification link. No token provided.');
            return;
        }

        if (hasVerified.current) return;
        hasVerified.current = true;

        const verify = async () => {
            try {
                const result = await verifyEmail({ variables: { token } });

                if (result.data?.verifyEmail) {
                    const { token: accessToken, refreshToken } = result.data.verifyEmail;
                    localStorage.setItem('token', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                    setStatus('success');
                } else {
                    setStatus('error');
                    setErrorMessage('Verification failed. Please try again.');
                }
            } catch (err) {
                setStatus('error');
                setErrorMessage('Invalid or expired verification link.');
            }
        };

        verify();
    }, [token, verifyEmail]);

    if (status === 'verifying') {
        return (
            <div className="flex flex-col w-lg m-auto h-screen bg-white items-center justify-center px-6">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-black mx-auto mb-4 animate-spin" />
                    <h1 className="text-2xl font-bold text-black mb-2">Verifying your email...</h1>
                    <p className="text-gray-500">Please wait while we confirm your email address.</p>
                </div>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="flex flex-col w-lg m-auto h-screen bg-white items-center justify-center px-6">
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-black mb-2">Email Verified!</h1>
                    <p className="text-gray-500 mb-6">Your email has been successfully verified. You can now sign in.</p>
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

    return (
        <div className="flex flex-col w-lg m-auto h-screen bg-white items-center justify-center px-6">
            <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-black mb-2">Verification Failed</h1>
                <p className="text-gray-500 mb-6">{errorMessage}</p>
                <Link
                    to="/signin"
                    className="inline-block bg-black text-white py-3 px-8 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                    Go to Sign In
                </Link>
            </div>
        </div>
    );
};
