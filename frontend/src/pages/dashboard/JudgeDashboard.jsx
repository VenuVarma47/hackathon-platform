import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Award, Code, ExternalLink, Star, CheckCircle, ShieldAlert } from 'lucide-react';

const JudgeDashboard = () => {
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathon, setSelectedHackathon] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Score Modal State
  const [activeSubmission, setActiveSubmission] = useState(null);
  const [scores, setScores] = useState({
    innovationScore: 8,
    technicalScore: 8,
    designScore: 8,
    impactScore: 8,
    feedback: ''
  });
  const [scoreMsg, setScoreMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const res = await API.get('/hackathons');
        if (res.data.success && res.data.data.length > 0) {
          setHackathons(res.data.data);
          setSelectedHackathon(res.data.data[0]._id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchHackathons();
  }, []);

  useEffect(() => {
    if (!selectedHackathon) return;
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/submissions/hackathon/${selectedHackathon}`);
        if (res.data.success) {
          setSubmissions(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [selectedHackathon]);

  const handleScoreSubmit = async (e) => {
    e.preventDefault();
    setScoreMsg('');
    setSubmitting(true);

    try {
      const res = await API.post('/evaluations', {
        hackathonId: selectedHackathon,
        submissionId: activeSubmission._id,
        ...scores
      });

      if (res.data.success) {
        setScoreMsg('Scorecard evaluation submitted successfully!');
        setTimeout(() => {
          setActiveSubmission(null);
          setScoreMsg('');
        }, 1500);

        // Refresh submissions
        const refreshRes = await API.get(`/submissions/hackathon/${selectedHackathon}`);
        if (refreshRes.data.success) {
          setSubmissions(refreshRes.data.data);
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit score');
    } finally {
      setSubmitting(false);
    }
  };

  const totalCalculated = Number(scores.innovationScore) + Number(scores.technicalScore) + Number(scores.designScore) + Number(scores.impactScore);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-600/10 text-amber-400 rounded-2xl border border-amber-500/20">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Judge Evaluation Portal</h1>
            <p className="text-xs text-slate-400">Evaluate submitted repositories, grade criteria, and provide feedback</p>
          </div>
        </div>

        {/* Hackathon Event Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-400">Select Event:</span>
          <select
            value={selectedHackathon}
            onChange={(e) => setSelectedHackathon(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
          >
            {hackathons.map((h) => (
              <option key={h._id} value={h._id}>{h.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Project Entries ({submissions.length})</h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : submissions.length === 0 ? (
          <div className="glass-panel p-12 text-center text-slate-400 text-sm">
            No projects submitted yet for this hackathon.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {submissions.map((sub) => (
              <div key={sub._id} className="glass-panel p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-white text-base">{sub.projectTitle}</h3>
                    <div className="flex items-center space-x-1 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-extrabold text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{sub.averageScore || 0} / 40</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{sub.description}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Team: <strong className="text-white">{sub.team?.name}</strong></span>
                    {sub.repositoryUrl && (
                      <a href={sub.repositoryUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline flex items-center space-x-1 font-semibold">
                        <span>GitHub Repo</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => setActiveSubmission(sub)}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-amber-600/30"
                  >
                    Grade & Score Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grading Scorecard Modal */}
      {activeSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-black text-white">{activeSubmission.projectTitle}</h3>
                <p className="text-xs text-slate-400">Team: {activeSubmission.team?.name}</p>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Total Score</div>
                <div className="text-2xl font-black text-amber-400">{totalCalculated} / 40</div>
              </div>
            </div>

            {scoreMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>{scoreMsg}</span>
              </div>
            )}

            <form onSubmit={handleScoreSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Innovation (1-10)</label>
                  <input
                    type="number" min={1} max={10} required
                    value={scores.innovationScore}
                    onChange={(e) => setScores({ ...scores, innovationScore: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Technical Code (1-10)</label>
                  <input
                    type="number" min={1} max={10} required
                    value={scores.technicalScore}
                    onChange={(e) => setScores({ ...scores, technicalScore: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">UI / Design (1-10)</label>
                  <input
                    type="number" min={1} max={10} required
                    value={scores.designScore}
                    onChange={(e) => setScores({ ...scores, designScore: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Impact & Demo (1-10)</label>
                  <input
                    type="number" min={1} max={10} required
                    value={scores.impactScore}
                    onChange={(e) => setScores({ ...scores, impactScore: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Judge Feedback & Remarks</label>
                <textarea
                  rows={3}
                  value={scores.feedback}
                  onChange={(e) => setScores({ ...scores, feedback: e.target.value })}
                  placeholder="Great execution, clean modular architecture..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setActiveSubmission(null)} className="flex-1 py-2.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 bg-amber-600 text-white text-xs font-bold rounded-xl">Save Scorecard</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JudgeDashboard;
