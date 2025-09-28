import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import api from '../services/api';
import AuthLayout from "../components/AuthLayout";
import { Calendar, Mail, User } from "lucide-react";

const SignUp = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        dateOfBirth: '',
        otp: '',
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/signup/request-otp', { 
                email: formData.email,
                name: formData.name,
                dateOfBirth: formData.dateOfBirth
            });
            toast.success("OTP sent to your email");
            setStep(2);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup/verify-otp', {
        email: formData.email,
        otp: formData.otp,
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Signed up successfully!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign up" subtitle="Sign up to enjoy the feature of HD">
      {step === 1 && (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Your Name</label>
            <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2.5" placeholder="Jonas Khanwald" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Date of Birth</label>
             <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2.5" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
             <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2.5" placeholder="you@example.com" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
            {loading ? 'Sending...' : 'Get OTP'}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <p className="text-center text-sm text-gray-600">An OTP has been sent to <span className="font-medium">{formData.email}</span></p>
          <div>
            <label className="text-sm font-medium text-gray-700">OTP</label>
            <input type="text" name="otp" value={formData.otp} onChange={handleChange} required className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2.5 px-3" placeholder="Enter OTP" />
          </div>
          <button type="submit" disabled={loading} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
            {loading ? 'Verifying...' : 'Sign Up'}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-500">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default SignUp;