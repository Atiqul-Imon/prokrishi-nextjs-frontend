'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, Key, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { resetPasswordWithOTP } from '@/app/utils/api';

function ResetPasswordOTPForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const phone = searchParams.get('phone');

    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!phone) {
            toast.error("No phone number provided. Redirecting...");
            router.replace('/forgot-password');
        }
    }, [phone, router]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }
        if (!otp) {
            toast.error('Please enter the OTP code.');
            return;
        }
        setLoading(true);
        try {
            const data = await resetPasswordWithOTP(phone, otp, password);
            toast.success(data.message);
            router.push('/login');
        } catch (error) {
            toast.error(error.message || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Verify Your Phone</h1>
                    <p className="mt-2 text-gray-600">
                        An OTP was sent to <span className="font-semibold">{phone}</span>. Please enter it below.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Key className="w-5 h-5 text-gray-400" />
                        </span>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter 6-digit OTP"
                            maxLength="6"
                            required
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg tracking-[0.3em] text-center"
                        />
                    </div>
                    <div className="relative">
                         <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Lock className="w-5 h-5 text-gray-400" />
                         </span>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="New Password"
                            required
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg"
                        />
                         <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3">
                            {showPassword ? <EyeOff className="w-5 h-5 text-gray-500"/> : <Eye className="w-5 h-5 text-gray-500"/>}
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !phone}
                        className="w-full px-4 py-2 font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50"
                    >
                        {loading ? 'Verifying...' : 'Verify & Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}

// Use Suspense to handle the initial render while searchParams are not available
export default function ResetPasswordOTPPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordOTPForm />
        </Suspense>
    );
} 