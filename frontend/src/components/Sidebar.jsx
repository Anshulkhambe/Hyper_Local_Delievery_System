import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Map, 
  Users, 
  LogOut, 
  Truck,
  Settings,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const adminLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Orders', path: '/orders', icon: ShoppingBag },
    { name: 'Route Optimization', path: '/optimize', icon: Map },
    { name: 'Delivery Agents', path: '/agents', icon: Users },
  ];

  const deliveryLinks = [
    { name: 'My Deliveries', path: '/deliveries', icon: Truck },
    { name: 'Route Map', path: '/route', icon: Map },
  ];

  const links = user?.role === 'ADMIN' ? adminLinks : deliveryLinks;

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, logout!',
      customClass: {
        popup: 'rounded-3xl shadow-xl border border-slate-200/50'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire({
          title: 'Logged Out',
          text: 'You have been logged out successfully.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-3xl shadow-xl border border-slate-200/50'
          }
        });
      }
    });
  };

  return (
    <div className="w-64 h-screen glass-nav fixed left-0 top-0 p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/40">
          <Truck className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">FleetOpt</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => `
              flex items-center justify-between p-3 rounded-xl transition-all duration-300 group
              ${isActive 
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' 
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}
            `}
          >
            <div className="flex items-center gap-3">
              <link.icon size={20} />
              <span className="font-medium">{link.name}</span>
            </div>
            <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-200/50 dark:border-slate-800/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
