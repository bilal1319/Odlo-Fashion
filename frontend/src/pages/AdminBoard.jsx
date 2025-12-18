// pages/AdminDashboard.jsx
import React, { useState, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Sidebar from '../components/Sidebar';

const AdminBoard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainContentRef = useRef(null);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left Side - Hamburger Menu */}
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>
                
              
              </div>

              {/* Right Side - User Menu */}
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <BellIcon className="h-6 w-6" />
                </button>
                
                {/* User Profile */}
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col text-right">
                    <span className="text-sm font-medium text-gray-900">Admin User</span>
                    <span className="text-xs text-gray-500">Super Admin</span>
                  </div>
                  <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">A</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main 
          ref={mainContentRef}
          className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100"
        >
          <div className="max-w-7xl mx-auto">
            <Outlet /> {/* Child routes render here */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminBoard;