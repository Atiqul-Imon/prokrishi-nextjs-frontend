'use client';
export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, Key, Eye, EyeOff } from 'lucide-react';
import { resetPasswordWithOTP } from '@/app/utils/api';
import { useInlineMessage } from '@/hooks/useInlineMessage';
import { InlineMessage } from '@/components/InlineMessage';

function ResetPasswordOTPForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const phone = searchParams.get('phone');

    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { messages, success, error, removeMessage } = useInlineMessage();

    useEffect(() => {
        if (!phone) {
            error("No phone number provided. Redirecting...", 3000);
            setTimeout(() => router.replace('/forgot-password'), 2000);
        }
    }, [phone, router, error]);
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            error('Passwords do not match.', 5000);
            return;
        }
        if (!otp) {
            error('Please enter the OTP code.', 5000);
            return;
        }
        setLoading(true);
        try {
            const data = await resetPasswordWithOTP(phone!, otp, password);
            success(data.message, 3000);
            setTimeout(() => router.push('/login'), 2000);
        } catch (err: any) {
            error(err.message || 'Failed to reset password.', 5000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                {/* Inline Messages */}
                <div className="mb-4 space-y-2">
                    {messages.map((msg) => (
                        <InlineMessage
                            key={msg.id}
                            type={msg.type}
                            message={msg.message}
                            onClose={() => removeMessage(msg.id)}
                        />
                    ))}
                </div>

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
                            maxLength={6}
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
                    <div className="relative">
                         <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Lock className="w-5 h-5 text-gray-400" />
                         </span>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm New Password"
                            required
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                        />
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

export default function ResetPasswordOTPPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <p className="text-gray-600">Loading...</p>
            </div>
        }>
            <ResetPasswordOTPForm />
        </Suspense>
    );
} 