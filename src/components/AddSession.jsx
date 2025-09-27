import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { toast } from "sonner";
import { CalendarIcon, Clock, Target, Save } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../lib/utils";
import { addSession, initializeData } from "../utils/dataManager";

const AddSession = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [duration, setDuration] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initializeData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!duration || duration <= 0) {
      toast.error("Please enter a valid duration");
      return;
    }

    setIsLoading(true);
    
    try {
      const sessionData = {
        date: format(date, 'yyyy-MM-dd'),
        duration_minutes: parseInt(duration),
        problems_solved: 0 // Will be updated when problems are added
      };

      const newSession = addSession(sessionData);
      
      toast.success("Practice session logged successfully! 🎉", {
        description: `${duration} minutes on ${format(date, 'MMM dd, yyyy')}`
      });

      // Navigate back to dashboard after a short delay
      setTimeout(() => {
        navigate("/");
      }, 1500);
      
    } catch (error) {
      toast.error("Failed to save session. Please try again.");
      console.error("Error saving session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDuration = (minutes) => {
    setDuration(minutes.toString());
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 fade-in" data-testid="add-session-page">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-3">
          <Clock className="h-8 w-8 text-emerald-500" />
          Log Practice Session
          <span className="text-2xl">⏱️</span>
        </h1>
        <p className="text-gray-600">
          Track your DSA practice time and stay consistent! 💪
        </p>
      </div>

      <Card className="glass-card shadow-xl" data-testid="add-session-form">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2 text-emerald-500" />
            Session Details 📝
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Selection */}
            <div className="space-y-3">
              <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                Practice Date 📅
              </Label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                    data-testid="date-picker-trigger"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      setDate(selectedDate);
                      setIsCalendarOpen(false);
                    }}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Duration Input */}
            <div className="space-y-3">
              <Label htmlFor="duration" className="text-sm font-medium text-gray-700">
                Duration (minutes) ⏰
              </Label>
              <div className="space-y-3">
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  max="600"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Enter practice duration"
                  className="text-lg"
                  data-testid="duration-input"
                />
                
                {/* Quick Duration Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Label className="text-xs text-gray-500 w-full">Quick select:</Label>
                  {[15, 30, 45, 60, 90, 120].map((minutes) => (
                    <Button
                      key={minutes}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickDuration(minutes)}
                      className={`text-xs ${
                        duration === minutes.toString()
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                          : ''
                      }`}
                      data-testid={`quick-duration-${minutes}`}
                    >
                      {minutes}m
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Estimated Goals */}
            {duration && (
              <div className="bg-emerald-50 p-4 rounded-lg space-y-2">
                <h3 className="font-medium text-emerald-800 flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Estimated Goals 🎯
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-emerald-700">
                    <strong>Easy problems:</strong> {Math.ceil(parseInt(duration) / 10)}
                  </div>
                  <div className="text-emerald-700">
                    <strong>Medium problems:</strong> {Math.ceil(parseInt(duration) / 20)}
                  </div>
                  <div className="text-emerald-700">
                    <strong>Hard problems:</strong> {Math.ceil(parseInt(duration) / 40)}
                  </div>
                  <div className="text-emerald-700">
                    <strong>Review time:</strong> {Math.floor(parseInt(duration) * 0.2)}m
                  </div>
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
                data-testid="cancel-session-btn"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !duration}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                data-testid="save-session-btn"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Log Session ✨
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <h3 className="font-medium text-gray-800 flex items-center">
              <span className="text-lg mr-2">💡</span>
              Practice Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <span>🎯</span>
                <span>Start with easier problems to build confidence</span>
              </div>
              <div className="flex items-start space-x-2">
                <span>⏱️</span>
                <span>Set time limits to simulate interview conditions</span>
              </div>
              <div className="flex items-start space-x-2">
                <span>📝</span>
                <span>Take notes on key patterns and techniques</span>
              </div>
              <div className="flex items-start space-x-2">
                <span>🔄</span>
                <span>Review and revisit challenging problems</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddSession;