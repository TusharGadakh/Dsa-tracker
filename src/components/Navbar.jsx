import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { 
  Home, 
  Plus, 
  BarChart3, 
  Settings, 
  Code2,
  PlusCircle 
} from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Dashboard", emoji: "📊" },
    { path: "/add-session", icon: Plus, label: "Add Session", emoji: "⏱️" },
    { path: "/add-problem", icon: PlusCircle, label: "Log Problem", emoji: "🧩" },
    { path: "/analytics", icon: BarChart3, label: "Analytics", emoji: "📈" },
    { path: "/settings", icon: Settings, label: "Settings", emoji: "⚙️" },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-emerald-400 to-green-500 p-2 rounded-xl group-hover:scale-105 transition-transform">
              <Code2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">DSA Tracker</h1>
              <p className="text-xs text-gray-500">Master algorithms daily</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={`flex items-center space-x-2 transition-all ${
                      isActive 
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg" 
                        : "hover:bg-emerald-50 text-gray-600"
                    }`}
                    data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                  >
                    <span className="text-sm">{item.emoji}</span>
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline text-sm font-medium">
                      {item.label}
                    </span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;