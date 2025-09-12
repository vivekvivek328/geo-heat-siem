import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  TrendingUp, 
  Eye, 
  Zap,
  CheckCircle,
  XCircle
} from "lucide-react";

const SecurityMetrics = () => {
  const metrics = [
    {
      title: "Active Threats",
      value: "23",
      change: "+5",
      trend: "up",
      icon: AlertTriangle,
      color: "destructive",
      description: "Detected in last 24h"
    },
    {
      title: "Blocked Attacks",
      value: "1,247",
      change: "+12%",
      trend: "up",
      icon: Shield,
      color: "success",
      description: "Successfully mitigated"
    },
    {
      title: "Events Processed",
      value: "856K",
      change: "+8%",
      trend: "up",
      icon: Activity,
      color: "primary",
      description: "Real-time monitoring"
    },
    {
      title: "System Health",
      value: "98.5%",
      change: "-0.2%",
      trend: "down",
      icon: CheckCircle,
      color: "success",
      description: "All systems operational"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "destructive":
        return "text-destructive bg-destructive/10 border-destructive/20";
      case "success":
        return "text-success bg-success/10 border-success/20";
      case "primary":
        return "text-primary bg-primary/10 border-primary/20";
      default:
        return "text-muted-foreground bg-muted/10 border-muted/20";
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="w-3 h-3 text-success" />
    ) : (
      <TrendingUp className="w-3 h-3 text-destructive rotate-180" />
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card 
          key={index}
          className="p-6 bg-card/50 backdrop-blur-sm shadow-card border border-border/50 hover:shadow-cyber transition-all duration-300 group"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-2 rounded-lg border ${getColorClasses(metric.color)}`}>
                  <metric.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {metric.value}
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {getTrendIcon(metric.trend)}
                    <span className={`text-xs font-medium ${
                      metric.trend === "up" ? "text-success" : "text-destructive"
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {metric.description}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mt-4 w-full bg-muted/20 rounded-full h-1">
            <div 
              className={`h-1 rounded-full transition-all duration-500 ${
                metric.color === "destructive" 
                  ? "bg-gradient-threat" 
                  : metric.color === "success"
                  ? "bg-gradient-safe"
                  : "bg-gradient-cyber"
              }`}
              style={{ 
                width: `${Math.min(
                  100, 
                  parseInt(metric.value.replace(/[^\d]/g, '')) / 10
                )}%` 
              }}
            />
          </div>
        </Card>
      ))}
    </div>
  );
};

export { SecurityMetrics };