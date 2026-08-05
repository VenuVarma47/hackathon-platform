import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Calendar, Users, Trophy, Award, Code, CheckCircle, PlusCircle, Shield, FileText, BarChart3, ExternalLink } from 'lucide-react';

const HackathonDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  
  // Team Creation Modal State
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [createdTeam, setCreatedTeam] = useState(null);
  const [teamError, setTeamError] = useState('');

  // Submit Project Modal State
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [subFormData, setSubFormData] = useState({
    projectTitle: '',
    tagline: '',
    description: '',
    repositoryUrl: '',
    demoVideoUrl: '',
    liveDemoUrl: '',
    techStack: ''
  });
  const [subSuccess, setSubSuccess] = useState('');
  const [subError, setSubError] = useState('');

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/hackathons/${id}`);
      if (res.data.success) {
        setHackathon(res.data.data);
      }

      const subRes = await API.get(`/submissions/hackathon/${id}`);
      if (subRes.data.success) {
        setSubmissions(subRes.data.data);
      }
    } catch (err) {
      console.error('Error loading hackathon:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setTeamError('');
    try {
      const res = await API.post('/teams', {
        name: teamName,
        hackathonId: id
      });
      if (res.data.success) {
        setCreatedTeam(res.data.data);
        setTeamName('');
      }
    } catch (err) {
      setTeamError(err.response?.data?.message || 'Failed to create team');
    }
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    setSubError('');
    setSubSuccess('');

    if (!createdTeam && user?.role === 'Participant') {
      // Find team if user is leader/member
      try {
        const teamRes = await API.get('/teams/my-teams');
        const activeTeam = teamRes.data.data.find(t => t.hackathon._id === id);
        if (!activeTeam) {
          setSubError('You must register/create a team for this hackathon first.');
          return;
        }
        await postSubmission(activeTeam._id);
      } catch (err) {
        setSubError('Error verifying team registration.');
      }
    } else if (createdTeam) {
      await postSubmission(createdTeam._id);
    }
  };

  const postSubmission = async (teamId) => {
    try {
      const res = await API.post('/submissions', {
        hackathonId: id,
        teamId,
        ...subFormData
      });
      if (res.data.success) {
        setSubSuccess('Project submitted successfully!');
        setShowSubmitModal(false);
        fetchDetails();
      }
    } catch (err) {
      setSubError(err.response?.data?.message || 'Submission failed');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hackathon) {
    return <div className="text-center py-12 text-white">Hackathon not found.</div>;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="glass-panel overflow-hidden relative">
        <div className="h-64 sm:h-80 relative">
          <img src={hackathon.bannerImage} alt={hackathon.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
        </div>

        <div className="p-8 -mt-24 relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {hackathon.category}
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white mt-2">{hackathon.title}</h1>
              <p className="text-slate-300 text-sm mt-1">{hackathon.tagline}</p>
            </div>

            {/* Live Leaderboard Button */}
            <Link
              to={`/leaderboard/${id}`}
              className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-extrabold text-sm rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center space-x-2"
            >
              <Trophy className="w-5 h-5" />
              <span>Live Leaderboard</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Event Dates</div>
                <div className="text-xs font-bold text-white">{new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Team Size</div>
                <div className="text-xs font-bold text-white">{hackathon.minTeamSize} - {hackathon.maxTeamSize} Members</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Award className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Prize Pool</div>
                <div className="text-xs font-bold text-white">{hackathon.prizePool}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Organizer</div>
                <div className="text-xs font-bold text-white">{hackathon.organizer?.name || 'College Admin'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Details & Action Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Description & Rules */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span>About the Hackathon</span>
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {hackathon.description}
            </p>
          </div>

          <div className="glass-panel p-6 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>Guidelines & Rules</span>
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {hackathon.rules}
            </p>
          </div>

          {/* Submissions Section */}
          <div className="glass-panel p-6 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Code className="w-5 h-5 text-pink-400" />
                <span>Project Submissions ({submissions.length})</span>
              </span>
            </h2>

            {submissions.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No submissions yet for this hackathon.</p>
            ) : (
              <div className="space-y-3">
                {submissions.map((sub) => (
                  <div key={sub._id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">{sub.projectTitle}</h4>
                      <p className="text-xs text-slate-400">{sub.team?.name} • Score: <span className="text-amber-400 font-bold">{sub.averageScore}</span></p>
                    </div>
                    {sub.repositoryUrl && (
                      <a href={sub.repositoryUrl} target="_blank" rel="noreferrer" className="p-2 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-lg text-xs font-semibold flex items-center space-x-1">
                        <span>Repo</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Participant Action Controls */}
        <div className="space-y-6">
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Participation Portal</h3>
            <p className="text-xs text-slate-400">
              Form or join a team to submit your repository before the deadline.
            </p>

            {user ? (
              user.role === 'Participant' ? (
                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => setShowTeamModal(true)}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create & Register Team</span>
                  </button>

                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30"
                  >
                    <Code className="w-4 h-4" />
                    <span>Submit Project Code</span>
                  </button>
                </div>
              ) : user.role === 'Judge' ? (
                <Link
                  to="/dashboard/judge"
                  className="block text-center w-full py-3 px-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-amber-600/30"
                >
                  Go to Judge Evaluation Portal
                </Link>
              ) : (
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400">
                  Logged in as <span className="text-white font-bold">{user.role}</span>.
                </div>
              )
            ) : (
              <Link
                to="/login"
                className="block text-center w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/30"
              >
                Sign In to Participate
              </Link>
            )}
          </div>
        </div>

      </div>

      {/* Team Creation Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Create & Register Team</h3>
            
            {teamError && <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl">{teamError}</div>}

            {createdTeam ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2 text-center">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-sm">Team Created!</h4>
                <p className="text-xs text-slate-300">Share this unique Join Code with your teammates:</p>
                <div className="text-2xl font-black tracking-widest text-emerald-400 bg-slate-950 py-2 rounded-xl border border-emerald-500/30 select-all">
                  {createdTeam.code}
                </div>
                <button
                  onClick={() => setShowTeamModal(false)}
                  className="mt-3 w-full py-2 bg-slate-800 text-white text-xs font-bold rounded-lg"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Team Name</label>
                  <input
                    type="text"
                    required
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. AlgoRhythms"
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex space-x-3">
                  <button type="button" onClick={() => setShowTeamModal(false)} className="flex-1 py-2.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl">Create Team</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Project Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white">Submit Project Code</h3>

            {subError && <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl">{subError}</div>}
            {subSuccess && <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl">{subSuccess}</div>}

            <form onSubmit={handleSubmitProject} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={subFormData.projectTitle}
                  onChange={(e) => setSubFormData({ ...subFormData, projectTitle: e.target.value })}
                  placeholder="Hackathon Management Platform"
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Repository URL</label>
                <input
                  type="url"
                  required
                  value={subFormData.repositoryUrl}
                  onChange={(e) => setSubFormData({ ...subFormData, repositoryUrl: e.target.value })}
                  placeholder="https://github.com/user/project-repo"
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Project Description</label>
                <textarea
                  rows={3}
                  required
                  value={subFormData.description}
                  onChange={(e) => setSubFormData({ ...subFormData, description: e.target.value })}
                  placeholder="Key features, tech stack used, architecture overview..."
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Demo Video URL</label>
                  <input
                    type="url"
                    value={subFormData.demoVideoUrl}
                    onChange={(e) => setSubFormData({ ...subFormData, demoVideoUrl: e.target.value })}
                    placeholder="Loom / YouTube link"
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Live App URL</label>
                  <input
                    type="url"
                    value={subFormData.liveDemoUrl}
                    onChange={(e) => setSubFormData({ ...subFormData, liveDemoUrl: e.target.value })}
                    placeholder="https://app.vercel.app"
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setShowSubmitModal(false)} className="flex-1 py-2.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl">Submit Code</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HackathonDetail;
