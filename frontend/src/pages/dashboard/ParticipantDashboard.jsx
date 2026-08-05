import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { Users, Code, Trophy, ChevronRight, Key } from 'lucide-react';

const ParticipantDashboard = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserTeams = async () => {
      try {
        setLoading(true);
        const res = await API.get('/teams/my-teams');
        if (res.data.success) {
          setTeams(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch user teams:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTeams();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-pink-600/10 text-pink-400 rounded-2xl border border-pink-500/20">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Participant Dashboard</h1>
            <p className="text-xs text-slate-400">Manage registered teams, view join codes, and track project submissions</p>
          </div>
        </div>

        <Link
          to="/teams"
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/30"
        >
          Form or Join Team
        </Link>
      </div>

      {/* Teams Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">My Active Registrations ({teams.length})</h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : teams.length === 0 ? (
          <div className="glass-panel p-12 text-center space-y-4">
            <Trophy className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Hackathon Teams Registered</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Explore open hackathons to create a team or join using a 6-digit invitation code.
            </p>
            <Link to="/hackathons" className="inline-block px-4 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl">
              Browse Hackathons
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teams.map((t) => (
              <div key={t._id} className="glass-panel p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="font-extrabold text-white text-base">{t.name}</h3>
                    <p className="text-xs text-indigo-400 font-semibold mt-0.5">{t.hackathon?.title}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                    t.status === 'Submitted' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  }`}>
                    {t.status}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <Key className="w-4 h-4 text-amber-400" />
                    <span>Team Join Code:</span>
                  </div>
                  <div className="text-sm font-black text-amber-400 tracking-wider select-all">{t.code}</div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-400 mb-2">Team Members ({t.members?.length}):</div>
                  <div className="flex flex-wrap gap-2">
                    {t.members?.map((m) => (
                      <span key={m._id} className="px-2.5 py-1 bg-slate-800/80 rounded-lg text-xs text-slate-300 font-medium">
                        {m.name} {m._id === t.leader?._id && '👑'}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to={`/hackathons/${t.hackathon?._id}`}
                    className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2"
                  >
                    <span>View Hackathon & Submit Code</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantDashboard;
