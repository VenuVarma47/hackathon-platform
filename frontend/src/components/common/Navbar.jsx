import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Code2, Trophy, LayoutDashboard, PlusCircle, Users, Award, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'Admin': return '/dashboard/admin';
      case 'Organizer': return '/dashboard/organizer';
      case 'Judge': return '/dashboard/judge';
      default: return '/dashboard/participant';
    }
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <Code2 className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-xl tracking-tight gradient-text">
            HackathonX
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link to="/hackathons" className="flex items-center space-x-1.5 text-slate-300 hover:text-white transition">
            <Trophy className="w-4 h-4 text-indigo-400" />
            <span>Hackathons</span>
          </Link>

          {user && (
            <>
              <Link to={getDashboardPath()} className="flex items-center space-x-1.5 text-slate-300 hover:text-white transition">
                <LayoutDashboard className="w-4 h-4 text-purple-400" />
                <span>Dashboard</span>
              </Link>

              {(user.role === 'Organizer' || user.role === 'Admin') && (
                <Link to="/hackathons/create" className="flex items-center space-x-1.5 text-indigo-400 hover:text-indigo-300 transition">
                  <PlusCircle className="w-4 h-4" />
                  <span>Host Hackathon</span>
                </Link>
              )}

              {user.role === 'Participant' && (
                <Link to="/teams" className="flex items-center space-x-1.5 text-slate-300 hover:text-white transition">
                  <Users className="w-4 h-4 text-pink-400" />
                  <span>My Teams</span>
                </Link>
              )}
            </>
          )}
        </nav>

        {/* User Account Action */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3 border-l border-slate-800 pl-4">
              <div className="text-right">
                <div className="text-xs font-semibold text-white">{user.name}</div>
                <div className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {user.role}
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition border border-slate-700/50 hover:border-rose-500/30"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition shadow-md shadow-indigo-600/30"
              >
                Login / Register
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
