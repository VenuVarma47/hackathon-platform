import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { Search, Filter, Calendar, Users, Trophy, ChevronRight, Tag } from 'lucide-react';

const HackathonList = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');

  const categories = ['All', 'Web Dev', 'AI/ML', 'Mobile App', 'Cybersecurity', 'Blockchain', 'General'];
  const statuses = ['All', 'Upcoming', 'Ongoing', 'Completed'];

  const fetchHackathons = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (status !== 'All') params.status = status;

      const res = await API.get('/hackathons', { params });
      if (res.data.success) {
        setHackathons(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch hackathons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHackathons();
  }, [category, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHackathons();
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-8 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Explore Events
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-3">
            Hackathons & <span className="gradient-text">Coding Competitions</span>
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Filter by category, search by title, build teams, and submit major projects for evaluation.
          </p>
        </div>
      </div>

      {/* Search & Filter Control Bar */}
      <div className="glass-panel p-4 flex flex-col md:flex-row items-center gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by hackathon title, tags, or keywords..."
            className="w-full pl-11 pr-24 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition"
          >
            Search
          </button>
        </form>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-400">Category:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-indigo-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-400">Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-indigo-500"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Hackathons Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : hackathons.length === 0 ? (
        <div className="glass-panel p-12 text-center space-y-4">
          <Trophy className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Hackathons Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search criteria or category filter to discover active competitions.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackathons.map((h) => (
            <div key={h._id} className="glass-panel overflow-hidden flex flex-col hover:border-slate-700 transition group">
              <div className="h-44 relative overflow-hidden bg-slate-900">
                <img
                  src={h.bannerImage}
                  alt={h.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    h.status === 'Ongoing' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    h.status === 'Upcoming' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                    'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {h.status}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Tag className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-xs font-semibold text-indigo-400">{h.category}</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-white group-hover:text-indigo-300 transition line-clamp-1">
                    {h.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {h.tagline || h.description}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{new Date(h.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>Team Size: {h.minTeamSize}-{h.maxTeamSize}</span>
                    </div>
                  </div>

                  <Link
                    to={`/hackathons/${h._id}`}
                    className="w-full py-2.5 px-4 bg-slate-800/80 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 border border-slate-700/60 hover:border-indigo-500"
                  >
                    <span>View Hackathon Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HackathonList;
