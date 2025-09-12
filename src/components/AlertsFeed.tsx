import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  AlertTriangle, 
  Shield, 
  Eye, 
  MapPin, 
  Clock,
  ExternalLink,
  ChevronRight
} from "lucide-react";

interface Alert {
  id: string;
  type: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  location: string;
  time: string;
  source: string;
  status: "active" | "investigating" | "resolved";
}

interface AlertsFeedProps {
  expanded?: boolean;
}

const AlertsFeed = ({ expanded = false }: AlertsFeedProps) => {
  const alerts: Alert[] = [
    {
      id: "1",
      type: "critical",
      title: "DDoS Attack Detected",
      description: "Large scale distributed denial of service attack targeting web servers",
      location: "New York, US",
      time: "2 minutes ago",
      source: "Firewall",
      status: "active"
    },
    {
      id: "2",
      type: "high",
      title: "Suspicious Login Attempts",
      description: "Multiple failed login attempts from unknown IP addresses",
      location: "London, UK",
      time: "5 minutes ago",
      source: "Auth System",
      status: "investigating"
    },
    {
      id: "3",
      type: "medium",
      title: "Malware Signature Match",
      description: "Known malware pattern detected in network traffic",
      location: "Tokyo, JP",
      time: "12 minutes ago",
      source: "IDS",
      status: "resolved"
    },
    {
      id: "4",
      type: "high",
      title: "Port Scanning Activity",
      description: "Systematic port scanning detected from external source",
      location: "Sydney, AU",
      time: "18 minutes ago",
      source: "Network Monitor",
      status: "active"
    },
    {
      id: "5",
      type: "low",
      title: "Unusual Bandwidth Usage",
      description: "Higher than normal bandwidth consumption detected",
      location: "Berlin, DE",
      time: "25 minutes ago",
      source: "Traffic Monitor",
      status: "investigating"
    },
    {
      id: "6",
      type: "critical",
      title: "Data Exfiltration Attempt",
      description: "Unauthorized data transfer attempt blocked",
      location: "San Francisco, US",
      time: "32 minutes ago",
      source: "DLP System",
      status: "resolved"
    }
  ];

  const getTypeColor = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return "destructive";
      case "high":
        return "warning";
      case "medium":
        return "outline";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getTypeIcon = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
      case "high":
        return AlertTriangle;
      case "medium":
        return Eye;
      case "low":
        return Shield;
      default:
        return Eye;
    }
  };

  const getStatusColor = (status: Alert["status"]) => {
    switch (status) {
      case "active":
        return "text-destructive";
      case "investigating":
        return "text-warning";
      case "resolved":
        return "text-success";
      default:
        return "text-muted-foreground";
    }
  };

  const displayAlerts = expanded ? alerts : alerts.slice(0, 5);

  return (
    <div className="space-y-4">
      <ScrollArea className={expanded ? "h-[600px]" : "h-[400px]"}>
        <div className="space-y-3">
          {displayAlerts.map((alert) => {
            const TypeIcon = getTypeIcon(alert.type);
            
            return (
              <div 
                key={alert.id}
                className="p-4 bg-muted/20 rounded-lg border border-border/30 hover:border-primary/30 transition-all duration-200 group cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    alert.type === "critical" 
                      ? "bg-destructive/20 text-destructive threat-glow" 
                      : alert.type === "high"
                      ? "bg-warning/20 text-warning"
                      : "bg-primary/20 text-primary"
                  }`}>
                    <TypeIcon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                        {alert.title}
                      </h4>
                      <Badge variant={getTypeColor(alert.type)} className="text-xs shrink-0">
                        {alert.type.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {alert.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{alert.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{alert.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={getStatusColor(alert.status)}>
                          {alert.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-muted-foreground">
                        Source: {alert.source}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        View Details
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {!expanded && alerts.length > 5 && (
        <Button variant="outline" className="w-full text-sm">
          View All Alerts ({alerts.length})
          <ExternalLink className="w-3 h-3 ml-2" />
        </Button>
      )}
    </div>
  );
};

export { AlertsFeed };