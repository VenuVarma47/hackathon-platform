import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Users, Key, PlusCircle, CheckCircle, ShieldAlert } from 'lucide-react';

const TeamManager = () => {
  const [joinCode, setJoinCode] = useState('');
  const [myTeams, setMyTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const fetchMyTeams = async () => {
    try {
      setLoading(true);
      const res = await API.get('/teams/my-teams');
      if (res.data.success) {
        setMyTeams(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTeams();
  }, []);

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');

    try {
      const res = await API.post('/teams/join', { code: joinCode });
      if (res.data.success) {
        setMsg(res.data.message);
        setJoinCode('');
        fetchMyTeams();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join team.');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Join Team Banner */}
      <div className="glass-panel p-8 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
            <Key className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Join a Team by Invitation Code</h1>
            <p className="text-xs text-slate-400">Enter the 6-character team join code provided by your team leader</p>
          </div>
        </div>

        {msg && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span>{msg}</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleJoinTeam} className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            required
            maxLength={6}
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="e.g. A3F89B"
            className="flex-1 w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-base tracking-widest font-black uppercase focus:outline-none focus:border-indigo-500 placeholder:normal-case placeholder:font-normal placeholder:tracking-normal placeholder:text-sm"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition shadow-lg shadow-indigo-600/30"
          >
            Join Team
          </button>
        </form>
      </div>

      {/* Registered Teams */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">My Active Team Memberships ({myTeams.length})</h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : myTeams.length === 0 ? (
          <div className="glass-panel p-8 text-center text-slate-400 text-xs">
            You are not part of any team yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myTeams.map((t) => (
              <div key={t._id} className="glass-panel p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-white text-base">{t.name}</h3>
                  <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full text-[10px] font-bold select-all">
                    Code: {t.code}
                  </span>
                </div>
                <p className="text-xs text-indigo-300 font-semibold">{t.hackathon?.title}</p>
                <div className="text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <strong>Leader:</strong> {t.leader?.name} ({t.leader?.email})
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamManager;
