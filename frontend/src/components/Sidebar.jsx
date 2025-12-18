// components/Sidebar.jsx
import React from 'react';
import { 
  HomeIcon,
  Squares2X2Icon,
  CubeIcon,
  Cog6ToothIcon,
  PlusCircleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', icon: HomeIcon, path: '/admin' },
    { name: 'Services', icon: Squares2X2Icon, path: '/admin/service' },
    { name: 'Bundles', icon: CubeIcon, path: '/admin/bundle' },
    { name: 'Analytics', icon: ChartBarIcon, path: '/admin/analytics' },
    { name: 'Settings', icon: Cog6ToothIcon, path: '/admin/settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-64 bg-gray-900 text-white
        transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg" />
            <h1 className="text-xl font-bold tracking-tight">ODLO ADMIN</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                ${location.pathname === item.path 
                  ? 'bg-gray-800 text-white border-l-4 border-gray-700' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }
              `}
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-800 mt-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 px-4">
            Quick Create
          </p>
          <div className="space-y-1">
            <Link
              to="/admin/service"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              <PlusCircleIcon className="h-5 w-5" />
              <span>Create Service</span>
            </Link>
            <Link
              to="/admin/bundle"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              <PlusCircleIcon className="h-5 w-5" />
              <span>Create Bundle</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;