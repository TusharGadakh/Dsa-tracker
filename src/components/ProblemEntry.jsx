import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { toast } from "sonner";
import { PlusCircle, Clock, Trophy, BookOpen, Save, Target } from "lucide-react";
import { addProblem, getTopics, initializeData } from "../utils/dataManager";

const ProblemEntry = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    difficulty: "",
    topic: "",
    attempts: 1,
    solved: false,
    time_spent_minutes: "",
    notes: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initializeData();
    const topicsData = getTopics();
    setTopics(topicsData);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Please enter a problem title");
      return;
    }
    
    if (!formData.difficulty) {
      toast.error("Please select a difficulty level");
      return;
    }
    
    if (!formData.topic) {
      toast.error("Please select a topic");
      return;
    }

    setIsLoading(true);
    
    try {
      const problemData = {
        ...formData,
        title: formData.title.trim(),
        attempts: parseInt(formData.attempts) || 1,
        time_spent_minutes: parseInt(formData.time_spent_minutes) || 0
      };

      const newProblem = addProblem(problemData);
      
      const successMessage = formData.solved 
        ? "Problem solved successfully! 🎉" 
        : "Problem logged for future reference! 📝";
      
      toast.success(successMessage, {
        description: `${formData.title} • ${formData.difficulty} • ${formData.topic}`
      });

      // Reset form
      setFormData({
        title: "",
        difficulty: "",
        topic: "",
        attempts: 1,
        solved: false,
        time_spent_minutes: "",
        notes: ""
      });
      
      // Navigate back after short delay
      setTimeout(() => {
        navigate("/");
      }, 1500);
      
    } catch (error) {
      toast.error("Failed to save problem. Please try again.");
      console.error("Error saving problem:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTopicEmoji = (topicName) => {
    const topic = topics.find(t => t.name === topicName);
    return topic ? topic.icon : '📚';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 fade-in" data-testid="problem-entry-page">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-3">
          <PlusCircle className="h-8 w-8 text-emerald-500" />
          Log DSA Problem
          <span className="text-2xl">🧩</span>
        </h1>
        <p className="text-gray-600">
          Track your problem-solving journey and build your expertise! 🚀
        </p>
      </div>

      <Card className="glass-card shadow-xl" data-testid="problem-entry-form">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-emerald-500" />
            Problem Details 📋
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Problem Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                Problem Title 📝
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Two Sum, Binary Tree Inorder Traversal"
                className="text-base"
                data-testid="problem-title-input"
              />
            </div>

            {/* Difficulty and Topic Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Difficulty */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Difficulty Level 🎯
                </Label>
                <Select 
                  value={formData.difficulty} 
                  onValueChange={(value) => handleInputChange('difficulty', value)}
                >
                  <SelectTrigger data-testid="difficulty-select" className="focus:ring-2 focus:ring-emerald-200">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white border shadow-lg">
                    <SelectItem value="Easy" className="cursor-pointer hover:bg-green-50">
                      <div className="flex items-center space-x-2">
                        <span>🟢</span>
                        <span>Easy</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Medium" className="cursor-pointer hover:bg-yellow-50">
                      <div className="flex items-center space-x-2">
                        <span>🟡</span>
                        <span>Medium</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Hard" className="cursor-pointer hover:bg-red-50">
                      <div className="flex items-center space-x-2">
                        <span>🔴</span>
                        <span>Hard</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Topic */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Topic Category 🏷️
                </Label>
                <Select 
                  value={formData.topic} 
                  onValueChange={(value) => handleInputChange('topic', value)}
                >
                  <SelectTrigger data-testid="topic-select" className="focus:ring-2 focus:ring-emerald-200">
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white border shadow-lg max-h-64 overflow-y-auto">
                    {topics.map((topic) => (
                      <SelectItem key={topic.id} value={topic.name} className="cursor-pointer hover:bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <span>{topic.icon}</span>
                          <span>{topic.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Attempts and Time Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Attempts */}
              <div className="space-y-2">
                <Label htmlFor="attempts" className="text-sm font-medium text-gray-700">
                  Number of Attempts 🔄
                </Label>
                <Input
                  id="attempts"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.attempts}
                  onChange={(e) => handleInputChange('attempts', e.target.value)}
                  className="text-base"
                  data-testid="attempts-input"
                />
              </div>

              {/* Time Spent */}
              <div className="space-y-2">
                <Label htmlFor="time_spent" className="text-sm font-medium text-gray-700">
                  Time Spent (minutes) ⏱️
                </Label>
                <Input
                  id="time_spent"
                  type="number"
                  min="0"
                  max="300"
                  value={formData.time_spent_minutes}
                  onChange={(e) => handleInputChange('time_spent_minutes', e.target.value)}
                  placeholder="0"
                  className="text-base"
                  data-testid="time-spent-input"
                />
              </div>
            </div>

            {/* Problem Status */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Problem Status 🏆
              </Label>
              <div className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200">
                <Switch
                  id="solved"
                  checked={formData.solved}
                  onCheckedChange={(checked) => handleInputChange('solved', checked)}
                  data-testid="solved-switch"
                />
                <div className="flex items-center space-x-2">
                  <Trophy className={`h-5 w-5 ${formData.solved ? 'text-green-500' : 'text-gray-400'}`} />
                  <Label htmlFor="solved" className="cursor-pointer">
                    {formData.solved ? "Problem Solved! 🎉" : "Still Working On It 🤔"}
                  </Label>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                Notes & Observations 📓
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Key insights, patterns learned, algorithms used, or areas for improvement..."
                className="min-h-[100px] text-base"
                data-testid="notes-textarea"
              />
            </div>

            {/* Preview Badge */}
            {(formData.difficulty || formData.topic) && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <Label className="text-sm font-medium text-gray-700">Preview 👀</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.difficulty && (
                    <Badge className={getDifficultyColor(formData.difficulty)}>
                      {formData.difficulty === 'Easy' ? '🟢' : 
                       formData.difficulty === 'Medium' ? '🟡' : '🔴'} {formData.difficulty}
                    </Badge>
                  )}
                  {formData.topic && (
                    <Badge variant="outline" style={{ borderColor: topics.find(t => t.name === formData.topic)?.color }}>
                      {getTopicEmoji(formData.topic)} {formData.topic}
                    </Badge>
                  )}
                  {formData.solved && (
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      ✅ Solved
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
                className="flex-1"
                data-testid="cancel-problem-btn"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                data-testid="save-problem-btn"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Log Problem ✨
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProblemEntry;