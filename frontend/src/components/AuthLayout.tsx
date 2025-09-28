import React from "react";

const AuthLayout = ({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) => {
    return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full mx-auto">
        <div className="flex items-center space-x-2 mb-8">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          <h1 className="text-2xl font-bold">HD</h1>
        </div>
        <div className="mb-6">
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="text-gray-500 mt-2">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;