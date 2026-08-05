import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Trophy, PlusCircle, Calendar, Users, Eye, Edit, Trash2 } from 'lucide-react';

const OrganizerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrganizerHackathons = async () => {
    try {
      setLoading(true);
      const res = await API.get('/hackathons');
      if (res.data.success) {
        // Filter hackathons created by current organizer (or show all if admin)
        const myHackathons = res.data.data.filter(
          h => h.organizer?._id === user._id || user.role === 'Admin'
        );
        setHackathons(myHackathons);
      }
    } catch (err) {
      console.error('Failed to fetch organizer hackathons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizerHackathons();
  }, []);

  const handleDeleteHackathon = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hackathon event?')) return;
    try {
      const res = await API.delete(`/hackathons/${id}`);
      if (res.data.success) {
        fetchOrganizerHackathons();
      }
    } catch (err) {
      alert('Failed to delete hackathon');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="glass-panel p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-600/10 text-purple-400 rounded-2xl border border-purple-500/20">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Organizer Dashboard</h1>
            <p className="text-xs text-slate-400">Manage hosted hackathons, timeline schedules, and project entries</p>
          </div>
        </div>

        <Link
          to="/hackathons/create"
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-lg shadow-indigo-600/30"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Host New Hackathon</span>
        </Link>
      </div>

      {/* Hackathons Table */}
      <div className="glass-panel overflow-x-auto">
        <div className="p-6 border-b border-slate-800 font-bold text-white text-base">
          My Hosted Events ({hackathons.length})
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : hackathons.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm space-y-3">
            <p>You haven't hosted any hackathons yet.</p>
            <Link to="/hackathons/create" className="inline-block px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl">
              Host Your First Hackathon
            </Link>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Hackathon Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {hackathons.map((h) => (
                <tr key={h._id} className="hover:bg-slate-900/40 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white text-sm">{h.title}</div>
                    <div className="text-xs text-slate-400">{h.prizePool}</div>
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-indigo-400">{h.category}</td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    {new Date(h.startDate).toLocaleDateString()} - {new Date(h.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      h.status === 'Ongoing' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      h.status === 'Upcoming' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {h.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      to={`/hackathons/${h._id}`}
                      className="p-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 inline-block transition"
                      title="View Event"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteHackathon(h._id)}
                      className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;
