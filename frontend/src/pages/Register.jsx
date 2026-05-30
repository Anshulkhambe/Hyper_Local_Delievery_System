import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Mail, Lock, User, UserPlus, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'ADMIN'
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      Swal.fire({
        title: 'Success!',
        text: 'Registration successful! Please login.',
        icon: 'success',
        confirmButtonColor: '#3b82f6',
        customClass: {
          popup: 'rounded-3xl shadow-xl border border-slate-200/50'
        }
      });
      navigate('/login');
    } catch (error) {
      toast.error('Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl glass-card p-10 rounded-3xl"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Create Account</h2>
          <p className="text-slate-500">Join FleetOpt and optimize your deliveries</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">First Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input
                type="text"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-transparent focus:border-primary-500 rounded-xl outline-none transition-all"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Last Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input
                type="text"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-transparent focus:border-primary-500 rounded-xl outline-none transition-all"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-transparent focus:border-primary-500 rounded-xl outline-none transition-all"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-transparent focus:border-primary-500 rounded-xl outline-none transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-3">
            <label className="text-sm font-medium ml-1">Select Role</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({...formData, role: 'ADMIN'})}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                  formData.role === 'ADMIN' 
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' 
                    : 'border-slate-100 dark:border-slate-800'
                }`}
              >
                <ShieldCheck className={formData.role === 'ADMIN' ? 'text-primary-600' : 'text-slate-400'} />
                <span className="font-bold">Shopkeeper</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, role: 'DELIVERY_BOY'})}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                  formData.role === 'DELIVERY_BOY' 
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' 
                    : 'border-slate-100 dark:border-slate-800'
                }`}
              >
                <Truck className={formData.role === 'DELIVERY_BOY' ? 'text-primary-600' : 'text-slate-400'} />
                <span className="font-bold">Delivery Boy</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-700 transition-all disabled:opacity-50 shadow-lg shadow-primary-500/30 mt-4"
            >
              {loading ? 'Creating Account...' : (
                <>
                  Register <UserPlus size={20} />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-slate-500">
          Already have an account? {' '}
          <Link to="/login" className="text-primary-600 font-bold hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
