import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../services/api';
import { Trophy, Award, ExternalLink, ArrowLeft, Star, Crown } from 'lucide-react';

const LeaderboardView = () => {
  const { hackathonId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/leaderboard/${hackathonId}`);
        if (res.data.success) {
          setLeaderboard(res.data.data);
          setHackathon(res.data.hackathon);
        }
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [hackathonId]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link to={`/hackathons/${hackathonId}`} className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Event Details</span>
        </Link>

        <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
          Live Competition Standings
        </span>
      </div>

      <div className="text-center space-y-3">
        <div className="inline-flex p-4 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-3xl text-white shadow-xl shadow-amber-500/20">
          <Trophy className="w-10 h-10" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">{hackathon?.title || 'Hackathon'} Leaderboard</h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">Rankings automatically updated based on aggregated judge evaluations across Innovation, Code Quality, UI Design & Impact.</p>
      </div>

      {/* Top 3 Podium Cards */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {topThree.map((item, index) => (
            <div
              key={item.submissionId}
              className={`glass-panel p-6 relative flex flex-col justify-between space-y-4 ${
                index === 0 ? 'border-2 border-amber-500/60 shadow-2xl shadow-amber-500/10 order-first md:order-2 md:-translate-y-4' :
                index === 1 ? 'border-slate-700 order-2 md:order-first' :
                'border-slate-700 order-3'
              }`}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center space-x-1 shadow-lg ${
                  index === 0 ? 'bg-amber-500 text-slate-950 shadow-amber-500/40' :
                  index === 1 ? 'bg-slate-300 text-slate-950 shadow-slate-300/40' :
                  'bg-amber-700 text-white shadow-amber-700/40'
                }`}>
                  {index === 0 && <Crown className="w-4 h-4" />}
                  <span>Rank #{item.rank}</span>
                </span>
              </div>

              <div className="pt-4 text-center space-y-2">
                <h3 className="font-extrabold text-xl text-white">{item.projectTitle}</h3>
                <p className="text-xs font-semibold text-indigo-400">Team: {item.teamName}</p>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-center space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Average Judge Score</div>
                <div className="text-3xl font-black text-amber-400">{item.averageScore} <span className="text-xs text-slate-500 font-normal">/ 40</span></div>
                <div className="text-[10px] text-slate-500">{item.evaluationCount} Judge Evaluations</div>
              </div>

              {item.repositoryUrl && (
                <a
                  href={item.repositoryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-bold rounded-xl flex items-center justify-center space-x-1 transition"
                >
                  <span>View Code Repo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Complete Leaderboard Table */}
      <div className="glass-panel overflow-x-auto mt-8">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Rank</th>
              <th className="px-6 py-4">Project Title</th>
              <th className="px-6 py-4">Team Name</th>
              <th className="px-6 py-4">Evaluations</th>
              <th className="px-6 py-4 text-right">Avg Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {leaderboard.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-500">No project submissions or evaluations recorded yet.</td>
              </tr>
            ) : (
              leaderboard.map((row) => (
                <tr key={row.submissionId} className="hover:bg-slate-900/40 transition">
                  <td className="px-6 py-4 font-black text-amber-400">#{row.rank}</td>
                  <td className="px-6 py-4 font-bold text-white">{row.projectTitle}</td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-300">{row.teamName}</td>
                  <td className="px-6 py-4 text-xs text-slate-400">{row.evaluationCount} Scores</td>
                  <td className="px-6 py-4 text-right font-black text-amber-400 text-base">{row.averageScore}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardView;
