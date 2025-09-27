// Data management utilities for localStorage with MySQL-ready structure
import { v4 as uuidv4 } from 'uuid';

// Default topics for DSA practice
export const DEFAULT_TOPICS = [
  { id: uuidv4(), name: "Arrays", color: "#ef4444", icon: "📊" },
  { id: uuidv4(), name: "Strings", color: "#f97316", icon: "🔤" },
  { id: uuidv4(), name: "Linked Lists", color: "#eab308", icon: "🔗" },
  { id: uuidv4(), name: "Stacks & Queues", color: "#22c55e", icon: "📚" },
  { id: uuidv4(), name: "Trees", color: "#06b6d4", icon: "🌳" },
  { id: uuidv4(), name: "Graphs", color: "#8b5cf6", icon: "🕸️" },
  { id: uuidv4(), name: "Dynamic Programming", color: "#ec4899", icon: "🎯" },
  { id: uuidv4(), name: "Recursion", color: "#f59e0b", icon: "🔄" },
  { id: uuidv4(), name: "Sorting", color: "#10b981", icon: "🔢" },
  { id: uuidv4(), name: "Searching", color: "#3b82f6", icon: "🔍" }
];

// Initialize default data
export const initializeData = () => {
  if (!localStorage.getItem('dsa_tracker_topics')) {
    localStorage.setItem('dsa_tracker_topics', JSON.stringify(DEFAULT_TOPICS));
  }
  
  if (!localStorage.getItem('dsa_tracker_sessions')) {
    localStorage.setItem('dsa_tracker_sessions', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('dsa_tracker_problems')) {
    localStorage.setItem('dsa_tracker_problems', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('dsa_tracker_settings')) {
    const defaultSettings = {
      daily_goal: 3,
      weekly_goal: 20,
      preferred_difficulty: 'Medium',
      theme: 'light'
    };
    localStorage.setItem('dsa_tracker_settings', JSON.stringify(defaultSettings));
  }
};

// Practice Sessions CRUD
export const getSessions = () => {
  const sessions = localStorage.getItem('dsa_tracker_sessions');
  return sessions ? JSON.parse(sessions) : [];
};

export const addSession = (sessionData) => {
  const sessions = getSessions();
  const newSession = {
    id: uuidv4(),
    user_id: 'default_user', // For future backend integration
    date: sessionData.date,
    duration_minutes: sessionData.duration_minutes,
    problems_solved: sessionData.problems_solved || 0,
    created_at: new Date().toISOString()
  };
  
  sessions.push(newSession);
  localStorage.setItem('dsa_tracker_sessions', JSON.stringify(sessions));
  return newSession;
};

export const updateSession = (sessionId, updateData) => {
  const sessions = getSessions();
  const index = sessions.findIndex(session => session.id === sessionId);
  
  if (index !== -1) {
    sessions[index] = { ...sessions[index], ...updateData };
    localStorage.setItem('dsa_tracker_sessions', JSON.stringify(sessions));
    return sessions[index];
  }
  return null;
};

// Problems CRUD
export const getProblems = () => {
  const problems = localStorage.getItem('dsa_tracker_problems');
  return problems ? JSON.parse(problems) : [];
};

export const addProblem = (problemData) => {
  const problems = getProblems();
  const newProblem = {
    id: uuidv4(),
    user_id: 'default_user',
    session_id: problemData.session_id || null,
    title: problemData.title,
    difficulty: problemData.difficulty,
    topic: problemData.topic,
    attempts: problemData.attempts || 1,
    solved: problemData.solved || false,
    time_spent_minutes: problemData.time_spent_minutes || 0,
    notes: problemData.notes || '',
    created_at: new Date().toISOString()
  };
  
  problems.push(newProblem);
  localStorage.setItem('dsa_tracker_problems', JSON.stringify(problems));
  return newProblem;
};

// Topics CRUD
export const getTopics = () => {
  const topics = localStorage.getItem('dsa_tracker_topics');
  return topics ? JSON.parse(topics) : DEFAULT_TOPICS;
};

// Settings CRUD
export const getSettings = () => {
  const settings = localStorage.getItem('dsa_tracker_settings');
  return settings ? JSON.parse(settings) : {
    daily_goal: 3,
    weekly_goal: 20,
    preferred_difficulty: 'Medium',
    theme: 'light'
  };
};

export const updateSettings = (newSettings) => {
  const currentSettings = getSettings();
  const updatedSettings = { ...currentSettings, ...newSettings };
  localStorage.setItem('dsa_tracker_settings', JSON.stringify(updatedSettings));
  return updatedSettings;
};

// Analytics helpers
export const getAnalytics = () => {
  const sessions = getSessions();
  const problems = getProblems();
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  // Today's stats
  const todaySessions = sessions.filter(s => s.date === today);
  const todayProblems = problems.filter(p => p.created_at.split('T')[0] === today);
  
  // Week's stats
  const weekSessions = sessions.filter(s => s.date >= weekAgo);
  const weekProblems = problems.filter(p => p.created_at.split('T')[0] >= weekAgo);
  
  // Total stats
  const totalProblemsSolved = problems.filter(p => p.solved).length;
  const totalTimeSpent = sessions.reduce((acc, session) => acc + session.duration_minutes, 0);
  
  // Difficulty breakdown
  const difficultyStats = {
    Easy: problems.filter(p => p.difficulty === 'Easy' && p.solved).length,
    Medium: problems.filter(p => p.difficulty === 'Medium' && p.solved).length,
    Hard: problems.filter(p => p.difficulty === 'Hard' && p.solved).length
  };
  
  // Topic breakdown
  const topics = getTopics();
  const topicStats = topics.map(topic => ({
    ...topic,
    solved: problems.filter(p => p.topic === topic.name && p.solved).length,
    attempted: problems.filter(p => p.topic === topic.name).length
  }));
  
  return {
    today: {
      sessions: todaySessions.length,
      problems: todayProblems.filter(p => p.solved).length,
      timeSpent: todaySessions.reduce((acc, s) => acc + s.duration_minutes, 0)
    },
    week: {
      sessions: weekSessions.length,
      problems: weekProblems.filter(p => p.solved).length,
      timeSpent: weekSessions.reduce((acc, s) => acc + s.duration_minutes, 0)
    },
    total: {
      problems: totalProblemsSolved,
      timeSpent: Math.round(totalTimeSpent / 60), // Convert to hours
      sessions: sessions.length
    },
    difficulty: difficultyStats,
    topics: topicStats,
    streak: calculateStreak(sessions)
  };
};

// Calculate current streak
const calculateStreak = (sessions) => {
  if (sessions.length === 0) return 0;
  
  const dates = [...new Set(sessions.map(s => s.date))].sort().reverse();
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  
  for (let i = 0; i < dates.length; i++) {
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - i);
    const expectedDateStr = expectedDate.toISOString().split('T')[0];
    
    if (dates[i] === expectedDateStr) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};