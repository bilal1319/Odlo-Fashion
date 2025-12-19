// components/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Sidebar from './Sidebar';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Sidebar - Overlay on all screens */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main Content Area - Full width */}
      <div className="flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left Side - Toggle Sidebar Button (Always visible) */}
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                >
                  {sidebarOpen ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </button>
                {/* Logo for mobile */}
                <div className="ml-3 lg:hidden">
                  <div className="flex items-center space-x-2">
                    
                    <span className="font-bold text-gray-900">Admin</span>
                  </div>
                </div>
              </div>

              {/* Right Side - User Menu */}
              <div className="flex items-center space-x-4">
                <button 
                  className="p-2 text-gray-600 hover:text-gray-900 relative"
                  aria-label="Notifications"
                >
                  
                </button>
                
                {/* User Profile */}
                <div className="flex items-center space-x-3">
                  <div className="hidden md:flex flex-col text-right">
                    <span className="text-sm font-medium text-gray-900">Admin User</span>
                    <span className="text-xs text-gray-500">Super Admin</span>
                  </div>
                  <div className="h-8 w-8 bg-linear-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">A</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100 transition-all duration-300">
          {/* Optional: Show backdrop when sidebar is open on desktop */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/20 z-20 lg:block hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

       
      </div>
    </div>
  );
};

export default AdminLayout;