import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem("userInfo");
        toast.success("Signed out successfully");
        navigate("/signin");
    };

    return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          </div>
          <button onClick={handleSignOut} className="text-sm font-semibold text-blue-600 hover:text-blue-800">
            Sign Out
          </button>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;