import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ThreatChart = () => {
  // Mock data for the last 24 hours
  const data = [
    { time: '00:00', threats: 12, blocked: 45, processed: 1200 },
    { time: '02:00', threats: 8, blocked: 32, processed: 980 },
    { time: '04:00', threats: 15, blocked: 58, processed: 1100 },
    { time: '06:00', threats: 23, blocked: 78, processed: 1450 },
    { time: '08:00', threats: 18, blocked: 65, processed: 1320 },
    { time: '10:00', threats: 31, blocked: 95, processed: 1680 },
    { time: '12:00', threats: 45, blocked: 142, processed: 2100 },
    { time: '14:00', threats: 38, blocked: 128, processed: 1890 },
    { time: '16:00', threats: 52, blocked: 165, processed: 2350 },
    { time: '18:00', threats: 67, blocked: 198, processed: 2800 },
    { time: '20:00', threats: 43, blocked: 156, processed: 2150 },
    { time: '22:00', threats: 29, blocked: 89, processed: 1650 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/90 backdrop-blur-sm p-3 rounded-lg border border-border/50 shadow-cyber">
          <p className="text-foreground font-medium">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey === 'threats' ? 'Threats Detected' : 
                 entry.dataKey === 'blocked' ? 'Attacks Blocked' : 
                 'Events Processed'}: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Threats</p>
              <p className="text-2xl font-bold text-destructive">441</p>
            </div>
            <Badge variant="destructive" className="text-xs">
              +15%
            </Badge>
          </div>
        </div>
        
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Blocked Attacks</p>
              <p className="text-2xl font-bold text-success">1,251</p>
            </div>
            <Badge variant="outline" className="text-xs text-success border-success">
              +8%
            </Badge>
          </div>
        </div>
        
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Events Processed</p>
              <p className="text-2xl font-bold text-primary">21.7K</p>
            </div>
            <Badge variant="outline" className="text-xs text-primary border-primary">
              +12%
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="threatsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0 84% 60%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(0 84% 60%)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="blockedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142 71% 45%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(142 71% 45%)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="processedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(199 89% 48%)" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="hsl(199 89% 48%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--border))" 
              opacity={0.3}
            />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Processed events area (background) */}
            <Area
              type="monotone"
              dataKey="processed"
              stroke="hsl(199 89% 48%)"
              strokeWidth={1}
              fill="url(#processedGradient)"
              opacity={0.6}
            />
            
            {/* Blocked attacks area */}
            <Area
              type="monotone"
              dataKey="blocked"
              stroke="hsl(142 71% 45%)"
              strokeWidth={2}
              fill="url(#blockedGradient)"
            />
            
            {/* Threats detected line */}
            <Area
              type="monotone"
              dataKey="threats"
              stroke="hsl(0 84% 60%)"
              strokeWidth={3}
              fill="url(#threatsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-destructive rounded-full"></div>
          <span className="text-muted-foreground">Threats Detected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-success rounded-full"></div>
          <span className="text-muted-foreground">Attacks Blocked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span className="text-muted-foreground">Events Processed</span>
        </div>
      </div>
    </div>
  );
};

export { ThreatChart };