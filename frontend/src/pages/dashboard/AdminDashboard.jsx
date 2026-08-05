import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Shield, Users, Trash2, Search, CheckCircle, ShieldAlert } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [msg, setMsg] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;

      const res = await API.get('/users', { params });
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await API.put(`/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        setMsg(`Role updated to ${newRole}!`);
        fetchUsers();
      }
    } catch (err) {
      alert('Failed to update role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await API.delete(`/users/${userId}`);
      if (res.data.success) {
        setMsg('User deleted successfully');
        fetchUsers();
      }
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">System Admin Portal</h1>
            <p className="text-xs text-slate-400">User Management, Role Assignments & Platform Governance</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-xs text-slate-400">Total Users</div>
            <div className="text-xl font-black text-indigo-400">{users.length}</div>
          </div>
        </div>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="glass-panel p-4 flex flex-col sm:flex-row items-center gap-4">
        <form onSubmit={(e) => { e.preventDefault(); fetchUsers(); }} className="flex-1 w-full relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name, email, or college..."
            className="w-full pl-11 pr-24 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
          />
          <button type="submit" className="absolute right-1.5 top-1.5 px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-semibold">
            Search
          </button>
        </form>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-400">Role Filter:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Organizer">Organizer</option>
            <option value="Participant">Participant</option>
            <option value="Judge">Judge</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-panel overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">User Details</th>
              <th className="px-6 py-4">College</th>
              <th className="px-6 py-4">Current Role</th>
              <th className="px-6 py-4">Change Role</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-500">No users found.</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-900/40 transition">
                  <td className="px-6 py-4 flex items-center space-x-3">
                    <img src={u.profileImage} alt={u.name} className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700" />
                    <div>
                      <div className="font-bold text-white text-sm">{u.name}</div>
                      <div className="text-xs text-slate-400">{u.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium">{u.college || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      u.role === 'Admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                      u.role === 'Organizer' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                      u.role === 'Judge' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Participant">Participant</option>
                      <option value="Organizer">Organizer</option>
                      <option value="Judge">Judge</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
