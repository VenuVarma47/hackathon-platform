import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { UserPlus, User, Mail, Lock, Building, Code, ShieldAlert } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Participant',
    college: '',
    skills: '',
    bio: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await register(formData);
      if (res.success) {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-8 glass-panel p-8">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl text-white mb-3 shadow-lg shadow-indigo-500/20">
          <UserPlus className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white">Create Platform Account</h2>
        <p className="text-xs text-slate-400 mt-1">Select your platform role: Participant, Organizer, Judge, or Admin</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Selector Grid */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Select Account Role</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['Participant', 'Organizer', 'Judge', 'Admin'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setFormData({ ...formData, role: r })}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center space-y-1 ${
                  formData.role === r
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>{r}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">Full Name</label>
          <div className="relative">
            <User className="w-5 h-5 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full pl-11 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">Email Address</label>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="john@college.edu"
              className="w-full pl-11 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">Password</label>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              className="w-full pl-11 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">College / Institution</label>
            <div className="relative">
              <Building className="w-5 h-5 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="MIT / Stanford / IIT"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">Skills (Comma separated)</label>
            <div className="relative">
              <Code className="w-5 h-5 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, ML, Python"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-indigo-600/30 disabled:opacity-50 mt-4"
        >
          {loading ? 'Creating Account...' : 'Complete Registration'}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-slate-800 text-center">
        <p className="text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-indigo-400 hover:underline font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
