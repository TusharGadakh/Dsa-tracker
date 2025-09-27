import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { 
  Plus, 
  Clock, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  Calendar,
  PlusCircle,
  Brain
} from "lucide-react";
import { initializeData, getAnalytics, getSettings } from "../utils/dataManager";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeData();
    const analyticsData = getAnalytics();
    const settingsData = getSettings();
    
    setAnalytics(analyticsData);
    setSettings(settingsData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const todayProgress = settings ? (analytics.today.problems / settings.daily_goal) * 100 : 0;
  const weekProgress = settings ? (analytics.week.problems / settings.weekly_goal) * 100 : 0;

  return (
    <div className="space-y-8 fade-in" data-testid="dashboard">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
          <Brain className="h-10 w-10 text-emerald-500" />
          DSA Practice Dashboard
          <span className="text-3xl">🚀</span>
        </h1>
        <p className="text-gray-600 text-lg">
          Track your journey to algorithm mastery • Stay consistent, stay strong! 💪
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Link to="/add-session">
          <Button 
            className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover-lift"
            size="lg"
            data-testid="quick-add-session-btn"
          >
            <Plus className="h-5 w-5 mr-2" />
            Start Practice Session ⏰
          </Button>
        </Link>
        <Link to="/add-problem">
          <Button 
            variant="outline" 
            size="lg"
            className="border-emerald-200 hover:bg-emerald-50 hover-lift"
            data-testid="quick-add-problem-btn"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Log Problem 🧩
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Today's Progress */}
        <Card className="glass-card hover-lift" data-testid="today-progress-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-emerald-500" />
              Today's Progress 📅
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-800">
                  {analytics.today.problems}/{settings.daily_goal}
                </span>
                <Badge variant={todayProgress >= 100 ? "default" : "secondary"}>
                  {Math.round(todayProgress)}%
                </Badge>
              </div>
              <Progress 
                value={Math.min(todayProgress, 100)} 
                className="h-2"
              />
              <p className="text-sm text-gray-500">
                {analytics.today.timeSpent} minutes practiced
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Progress */}
        <Card className="glass-card hover-lift" data-testid="weekly-progress-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
              This Week 📈
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-800">
                  {analytics.week.problems}/{settings.weekly_goal}
                </span>
                <Badge variant={weekProgress >= 100 ? "default" : "secondary"}>
                  {Math.round(weekProgress)}%
                </Badge>
              </div>
              <Progress 
                value={Math.min(weekProgress, 100)} 
                className="h-2"
              />
              <p className="text-sm text-gray-500">
                {analytics.week.sessions} sessions completed
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Current Streak */}
        <Card className="glass-card hover-lift" data-testid="streak-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Target className="h-4 w-4 mr-2 text-orange-500" />
              Current Streak 🔥
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <span className="text-3xl font-bold text-orange-500">
                {analytics.streak}
              </span>
              <p className="text-sm text-gray-500">
                {analytics.streak === 1 ? 'day' : 'days'} in a row
              </p>
              <p className="text-xs text-gray-400">
                Keep it up! 🎯
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Total Progress */}
        <Card className="glass-card hover-lift" data-testid="total-progress-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              Total Solved ✅
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <span className="text-3xl font-bold text-green-500">
                {analytics.total.problems}
              </span>
              <p className="text-sm text-gray-500">
                {analytics.total.timeSpent}h practiced
              </p>
              <p className="text-xs text-gray-400">
                {analytics.total.sessions} total sessions
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Difficulty Breakdown */}
      <Card className="glass-card" data-testid="difficulty-breakdown-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2 text-emerald-500" />
            Difficulty Breakdown 🎯
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(analytics.difficulty).map(([difficulty, count]) => (
              <div key={difficulty} className="text-center space-y-2">
                <div className={`text-2xl font-bold ${
                  difficulty === 'Easy' ? 'text-green-500' :
                  difficulty === 'Medium' ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {count}
                </div>
                <Badge 
                  variant="outline" 
                  className={`${
                    difficulty === 'Easy' ? 'border-green-200 text-green-700' :
                    difficulty === 'Medium' ? 'border-yellow-200 text-yellow-700' : 
                    'border-red-200 text-red-700'
                  }`}
                >
                  {difficulty}
                </Badge>
                <div className="text-xs text-gray-500">
                  {difficulty === 'Easy' ? '🟢' : difficulty === 'Medium' ? '🟡' : '🔴'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Topics */}
      <Card className="glass-card" data-testid="topics-overview-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-emerald-500" />
              Topic Progress 🧠
            </span>
            <Link to="/analytics">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics.topics.slice(0, 6).map((topic) => (
              <div key={topic.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{topic.icon}</span>
                  <div>
                    <p className="font-medium text-gray-800">{topic.name}</p>
                    <p className="text-xs text-gray-500">
                      {topic.solved} solved • {topic.attempted} attempted
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold" style={{ color: topic.color }}>
                    {topic.attempted > 0 ? Math.round((topic.solved / topic.attempted) * 100) : 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;