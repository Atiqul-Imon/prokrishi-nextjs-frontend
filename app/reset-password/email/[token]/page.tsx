'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { resetPasswordWithToken } from '@/app/utils/api';
import { useInlineMessage } from '@/hooks/useInlineMessage';
import { InlineMessage } from '@/components/InlineMessage';

export default function ResetPasswordTokenPage() {
  const router = useRouter();
  const params = useParams();
  const token = Array.isArray(params.token) ? params.token[0] : params.token;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { messages, success, error, removeMessage } = useInlineMessage();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      error('Passwords do not match.', 5000);
      return;
    }
    if (!token) {
        error('Invalid or missing reset token.', 5000);
        return;
    }
    setLoading(true);
    try {
      const data = await resetPasswordWithToken(token, password);
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
          <h1 className="text-3xl font-bold text-gray-800">Reset Your Password</h1>
          <p className="mt-2 text-gray-600">Enter your new password below.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
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
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
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
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
            </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
} 