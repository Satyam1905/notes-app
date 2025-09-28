import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import AuthLayout from '../components/AuthLayout';

const SignIn = () => {
  const [step, setStep] = useState(1); // 1 for email, 2 for OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/signin/request-otp', { email });
      toast.success('OTP sent to your email!');
      setStep(2);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signin/verify-otp', { email, otp });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Signed in successfully!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign in" subtitle="Please login to continue to your account.">
      {step === 1 && (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2.5 px-3" placeholder="you@example.com" />
          </div>
          <button type="submit" disabled={loading} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
            {loading ? 'Sending...' : 'Get OTP'}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-center text-sm text-gray-600">An OTP has been sent to <span className="font-medium">{email}</span></p>
          <div>
            <label className="text-sm font-medium text-gray-700">OTP</label>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2.5 px-3" placeholder="Enter OTP" />
             <div className="text-right mt-2">
                <button type="button" onClick={handleRequestOtp} className="text-sm text-blue-600 hover:underline">Resend OTP</button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-gray-500">
        Need an account?{' '}
        <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
};

export default SignIn;