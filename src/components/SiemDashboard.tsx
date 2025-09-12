import { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GeoMap } from "./GeoMap";
import { SecurityMetrics } from "./SecurityMetrics";
import { AlertsFeed } from "./AlertsFeed";
import { ThreatChart } from "./ThreatChart";
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Globe, 
  Database, 
  Settings,
  Search,
  Bell
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SiemDashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Activity },
    { id: "threats", label: "Threat Map", icon: Globe },
    { id: "alerts", label: "Alerts", icon: AlertTriangle, badge: "12" },
    { id: "incidents", label: "Incidents", icon: Shield },
    { id: "logs", label: "Log Analysis", icon: Database },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-bg">
        {/* Sidebar */}
        <div className="w-64 bg-sidebar border-r border-sidebar-border">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-gradient-cyber rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-sidebar-foreground">SIEM Security</h1>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-all ${
                    activeView === item.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground border border-primary/30 cyber-glow"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge variant="destructive" className="ml-auto text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-card/50 backdrop-blur-sm border-b border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground capitalize">
                  {activeView}
                </h2>
                <p className="text-muted-foreground">
                  Real-time security monitoring and threat detection
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search events..." 
                    className="pl-10 w-64 bg-input/50 backdrop-blur-sm"
                  />
                </div>
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="w-4 h-4" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse" />
                </Button>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="flex-1 p-6 space-y-6 overflow-auto">
            {activeView === "dashboard" && (
              <div className="space-y-6">
                {/* Security Metrics */}
                <SecurityMetrics />

                {/* Main Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Geo Map */}
                  <Card className="xl:col-span-2 p-6 bg-card/50 backdrop-blur-sm shadow-card border border-border/50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-foreground">
                        Global Threat Map
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        Live Data
                      </Badge>
                    </div>
                    <GeoMap />
                  </Card>

                  {/* Alerts Feed */}
                  <Card className="p-6 bg-card/50 backdrop-blur-sm shadow-card border border-border/50">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Recent Alerts
                    </h3>
                    <AlertsFeed />
                  </Card>
                </div>

                {/* Threat Analysis Chart */}
                <Card className="p-6 bg-card/50 backdrop-blur-sm shadow-card border border-border/50">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Threat Analysis Timeline
                  </h3>
                  <ThreatChart />
                </Card>
              </div>
            )}

            {activeView === "threats" && (
              <Card className="p-6 bg-card/50 backdrop-blur-sm shadow-card border border-border/50">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Interactive Threat Map
                </h3>
                <div className="h-[calc(100vh-300px)]">
                  <GeoMap />
                </div>
              </Card>
            )}

            {activeView === "alerts" && (
              <Card className="p-6 bg-card/50 backdrop-blur-sm shadow-card border border-border/50">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Security Alerts Management
                </h3>
                <AlertsFeed expanded />
              </Card>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SiemDashboard;