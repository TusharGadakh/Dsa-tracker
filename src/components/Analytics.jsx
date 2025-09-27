import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target, 
  Award,
  Calendar,
  Brain,
  CheckCircle2
} from "lucide-react";
import { getAnalytics, getProblems, getSessions, initializeData } from "../utils/dataManager";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [problems, setProblems] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeData();
    const analyticsData = getAnalytics();
    const problemsData = getProblems();
    const sessionsData = getSessions();
    
    setAnalytics(analyticsData);
    setProblems(problemsData);
    setSessions(sessionsData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const getTopicProgress = (topic) => {
    const topicProblems = problems.filter(p => p.topic === topic.name);
    const solved = topicProblems.filter(p => p.solved).length;
    const total = topicProblems.length;
    return { solved, total, percentage: total > 0 ? (solved / total) * 100 : 0 };
  };

  const recentProblems = problems
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 10);

  const recentSessions = sessions
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <div className="space-y-8 fade-in" data-testid="analytics-page">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-3">
          <BarChart3 className="h-8 w-8 text-emerald-500" />
          Progress Analytics
          <span className="text-2xl">📈</span>
        </h1>
        <p className="text-gray-600">
          Deep insights into your DSA learning journey 📊
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card hover-lift" data-testid="total-solved-metric">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600 flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              Total Solved ✅
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500 mb-1">
              {analytics.total.problems}
            </div>
            <p className="text-sm text-gray-500">
              Problems completed
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift" data-testid="practice-time-metric">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600 flex items-center">
              <Clock className="h-4 w-4 mr-2 text-blue-500" />
              Practice Time ⏱️
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500 mb-1">
              {analytics.total.timeSpent}h
            </div>
            <p className="text-sm text-gray-500">
              Total hours practiced
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift" data-testid="current-streak-metric">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600 flex items-center">
              <Target className="h-4 w-4 mr-2 text-orange-500" />
              Current Streak 🔥
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500 mb-1">
              {analytics.streak}
            </div>
            <p className="text-sm text-gray-500">
              {analytics.streak === 1 ? 'day' : 'days'} active
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift" data-testid="success-rate-metric">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600 flex items-center">
              <Award className="h-4 w-4 mr-2 text-purple-500" />
              Success Rate 🎯
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-500 mb-1">
              {problems.length > 0 
                ? Math.round((analytics.total.problems / problems.length) * 100)
                : 0}%
            </div>
            <p className="text-sm text-gray-500">
              Problems solved vs attempted
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Difficulty Analysis */}
      <Card className="glass-card" data-testid="difficulty-analysis">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2 text-emerald-500" />
            Difficulty Distribution 🎯
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(analytics.difficulty).map(([difficulty, count]) => {
              const total = Object.values(analytics.difficulty).reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? (count / total) * 100 : 0;
              
              return (
                <div key={difficulty} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center space-x-2">
                      <span className="text-lg">
                        {difficulty === 'Easy' ? '🟢' : 
                         difficulty === 'Medium' ? '🟡' : '🔴'}
                      </span>
                      <span className="font-medium">{difficulty}</span>
                    </span>
                    <Badge variant="outline" className={
                      difficulty === 'Easy' ? 'border-green-200 text-green-700' :
                      difficulty === 'Medium' ? 'border-yellow-200 text-yellow-700' : 
                      'border-red-200 text-red-700'
                    }>
                      {count} solved
                    </Badge>
                  </div>
                  <Progress 
                    value={percentage} 
                    className={`h-2 ${
                      difficulty === 'Easy' ? '[&>div]:bg-green-500' :
                      difficulty === 'Medium' ? '[&>div]:bg-yellow-500' : 
                      '[&>div]:bg-red-500'
                    }`}
                  />
                  <p className="text-sm text-gray-500">
                    {percentage.toFixed(1)}% of total solved problems
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Topic Mastery */}
      <Card className="glass-card" data-testid="topic-mastery">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-emerald-500" />
            Topic Mastery 🧠
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {analytics.topics.map((topic) => {
              const progress = getTopicProgress(topic);
              
              return (
                <div key={topic.id} className="space-y-3 p-4 rounded-lg bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{topic.icon}</span>
                      <div>
                        <h3 className="font-medium">{topic.name}</h3>
                        <p className="text-sm text-gray-500">
                          {progress.solved}/{progress.total} problems
                        </p>
                      </div>
                    </div>
                    <Badge 
                      style={{ 
                        backgroundColor: `${topic.color}20`,
                        color: topic.color,
                        borderColor: `${topic.color}40`
                      }}
                    >
                      {Math.round(progress.percentage)}%
                    </Badge>
                  </div>
                  <Progress 
                    value={progress.percentage} 
                    className="h-2"
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Problems */}
        <Card className="glass-card" data-testid="recent-problems">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2 text-emerald-500" />
              Recent Problems 📝
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentProblems.length > 0 ? (
                recentProblems.map((problem, index) => (
                  <div key={problem.id} className="flex items-start justify-between p-3 rounded-lg bg-gray-50/50">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">
                          {problem.solved ? '✅' : '⏳'}
                        </span>
                        <h4 className="font-medium text-sm line-clamp-1">
                          {problem.title}
                        </h4>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            problem.difficulty === 'Easy' ? 'border-green-200 text-green-700' :
                            problem.difficulty === 'Medium' ? 'border-yellow-200 text-yellow-700' : 
                            'border-red-200 text-red-700'
                          }`}
                        >
                          {problem.difficulty}
                        </Badge>
                        <span className="text-xs text-gray-500">{problem.topic}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 ml-2">
                      {new Date(problem.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No problems logged yet. Start by adding some! 🚀
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <Card className="glass-card" data-testid="recent-sessions">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-emerald-500" />
              Recent Sessions ⏱️
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSessions.length > 0 ? (
                recentSessions.map((session, index) => (
                  <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {session.duration_minutes} minutes
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(session.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {session.problems_solved || 0} solved
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No practice sessions yet. Log your first session! 📅
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;