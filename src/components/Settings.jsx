import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "sonner";
import { 
  Settings as SettingsIcon, 
  Target, 
  Save, 
  RotateCcw,
  Trash2,
  AlertTriangle,
  Palette,
  Calendar,
  Trophy
} from "lucide-react";
import { 
  getSettings, 
  updateSettings, 
  initializeData, 
  getAnalytics 
} from "../utils/dataManager";

const Settings = () => {
  const [settings, setSettings] = useState({
    daily_goal: 3,
    weekly_goal: 20,
    preferred_difficulty: 'Medium',
    theme: 'light'
  });
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showClearData, setShowClearData] = useState(false);

  useEffect(() => {
    initializeData();
    const settingsData = getSettings();
    const analyticsData = getAnalytics();
    setSettings(settingsData);
    setAnalytics(analyticsData);
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updatedSettings = updateSettings(settings);
      toast.success("Settings saved successfully! 🎉", {
        description: "Your preferences have been updated."
      });
    } catch (error) {
      toast.error("Failed to save settings. Please try again.");
      console.error("Error saving settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    const defaultSettings = {
      daily_goal: 3,
      weekly_goal: 20,
      preferred_difficulty: 'Medium',
      theme: 'light'
    };
    setSettings(defaultSettings);
    toast.success("Settings reset to defaults! 🔄");
  };

  const handleClearData = () => {
    if (window.confirm("⚠️ This will delete ALL your practice data. This action cannot be undone. Are you sure?")) {
      localStorage.removeItem('dsa_tracker_sessions');
      localStorage.removeItem('dsa_tracker_problems');
      toast.success("All practice data cleared! 🗑️", {
        description: "You can start fresh with your DSA journey."
      });
      // Refresh analytics
      const analyticsData = getAnalytics();
      setAnalytics(analyticsData);
    }
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getDifficultyRecommendation = () => {
    if (!analytics || analytics.total.problems < 10) {
      return "Start with Easy problems to build confidence! 🌟";
    }

    const { Easy, Medium, Hard } = analytics.difficulty;
    const total = Easy + Medium + Hard;
    const easyPercentage = (Easy / total) * 100;
    const mediumPercentage = (Medium / total) * 100;

    if (easyPercentage > 70) {
      return "Try more Medium problems to challenge yourself! 💪";
    } else if (mediumPercentage > 60) {
      return "Consider mixing in some Hard problems! 🚀";
    } else {
      return "Great balance! Keep challenging yourself! ⭐";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-in" data-testid="settings-page">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-3">
          <SettingsIcon className="h-8 w-8 text-emerald-500" />
          Settings & Preferences
          <span className="text-2xl">⚙️</span>
        </h1>
        <p className="text-gray-600">
          Customize your DSA practice experience 🎯
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goals & Preferences */}
        <Card className="glass-card" data-testid="goals-settings">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-emerald-500" />
              Practice Goals 🎯
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Daily Goal */}
            <div className="space-y-3">
              <Label htmlFor="daily_goal" className="text-sm font-medium text-gray-700">
                Daily Problem Goal 📅
              </Label>
              <Input
                id="daily_goal"
                type="number"
                min="1"
                max="20"
                value={settings.daily_goal}
                onChange={(e) => handleInputChange('daily_goal', parseInt(e.target.value))}
                className="text-base"
                data-testid="daily-goal-input"
              />
              <p className="text-xs text-gray-500">
                Recommended: 2-5 problems per day for consistent progress
              </p>
            </div>

            {/* Weekly Goal */}
            <div className="space-y-3">
              <Label htmlFor="weekly_goal" className="text-sm font-medium text-gray-700">
                Weekly Problem Goal 📊
              </Label>
              <Input
                id="weekly_goal"
                type="number"
                min="5"
                max="100"
                value={settings.weekly_goal}
                onChange={(e) => handleInputChange('weekly_goal', parseInt(e.target.value))}
                className="text-base"
                data-testid="weekly-goal-input"
              />
              <p className="text-xs text-gray-500">
                Auto-calculated: {settings.daily_goal * 7} based on daily goal
              </p>
            </div>

            {/* Preferred Difficulty */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Preferred Difficulty 🎯
              </Label>
              <Select 
                value={settings.preferred_difficulty} 
                onValueChange={(value) => handleInputChange('preferred_difficulty', value)}
              >
                <SelectTrigger data-testid="preferred-difficulty-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">
                    <div className="flex items-center space-x-2">
                      <span>🟢</span>
                      <span>Easy</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Medium">
                    <div className="flex items-center space-x-2">
                      <span>🟡</span>
                      <span>Medium</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Hard">
                    <div className="flex items-center space-x-2">
                      <span>🔴</span>
                      <span>Hard</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {analytics && (
                <Alert className="border-blue-200 bg-blue-50">
                  <Trophy className="h-4 w-4 text-blue-500" />
                  <AlertDescription className="text-blue-700 text-sm">
                    {getDifficultyRecommendation()}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1"
                data-testid="reset-settings-btn"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                data-testid="save-settings-btn"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings ✨
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Overview */}
        <Card className="glass-card" data-testid="stats-overview">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-emerald-500" />
              Your Progress 📈
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {analytics && (
              <>
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center space-y-1">
                    <div className="text-2xl font-bold text-emerald-500">
                      {analytics.total.problems}
                    </div>
                    <p className="text-sm text-gray-600">Problems Solved</p>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-2xl font-bold text-blue-500">
                      {analytics.total.timeSpent}h
                    </div>
                    <p className="text-sm text-gray-600">Practice Time</p>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-2xl font-bold text-orange-500">
                      {analytics.streak}
                    </div>
                    <p className="text-sm text-gray-600">Day Streak</p>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-2xl font-bold text-purple-500">
                      {analytics.total.sessions}
                    </div>
                    <p className="text-sm text-gray-600">Sessions</p>
                  </div>
                </div>

                {/* Progress towards goals */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Today's Progress</span>
                      <Badge variant="outline">
                        {analytics.today.problems}/{settings.daily_goal}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((analytics.today.problems / settings.daily_goal) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Weekly Progress</span>
                      <Badge variant="outline">
                        {analytics.week.problems}/{settings.weekly_goal}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((analytics.week.problems / settings.weekly_goal) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Motivational Message */}
                <Alert className="border-emerald-200 bg-emerald-50">
                  <Trophy className="h-4 w-4 text-emerald-500" />
                  <AlertDescription className="text-emerald-700 text-sm">
                    {analytics.total.problems === 0 ? (
                      "Ready to start your DSA journey? Log your first problem! 🚀"
                    ) : analytics.streak >= 7 ? (
                      "Amazing! You're on a 7+ day streak! Keep the momentum going! 🔥"
                    ) : analytics.today.problems >= settings.daily_goal ? (
                      "Fantastic! You've reached today's goal! 🎯"
                    ) : (
                      `You're doing great! ${settings.daily_goal - analytics.today.problems} more problems to reach today's goal! 💪`
                    )}
                  </AlertDescription>
                </Alert>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Data Management */}
      <Card className="glass-card border-red-200" data-testid="data-management">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Data Management ⚠️
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Warning:</strong> The actions below will permanently delete your data. 
                Please make sure you have backed up any important information.
              </AlertDescription>
            </Alert>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => setShowClearData(!showClearData)}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
                data-testid="clear-data-toggle"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Data
              </Button>
              
              {showClearData && (
                <Button
                  onClick={handleClearData}
                  variant="destructive"
                  className="bg-red-500 hover:bg-red-600"
                  data-testid="confirm-clear-data"
                >
                  Yes, Delete Everything
                </Button>
              )}
            </div>

            <p className="text-sm text-gray-500">
              This will remove all practice sessions, problems, and reset your progress. 
              Your settings will be preserved.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;