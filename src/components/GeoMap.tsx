import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Zap, Shield } from 'lucide-react';

// Mock threat data for visualization
const threatData = [
  { lng: -74.006, lat: 40.7128, intensity: 0.8, type: 'DDoS', city: 'New York' },
  { lng: -0.1276, lat: 51.5074, intensity: 0.6, type: 'Malware', city: 'London' },
  { lng: 139.6917, lat: 35.6895, intensity: 0.9, type: 'Phishing', city: 'Tokyo' },
  { lng: -122.4194, lat: 37.7749, intensity: 0.7, type: 'Intrusion', city: 'San Francisco' },
  { lng: 2.3522, lat: 48.8566, intensity: 0.5, type: 'Spam', city: 'Paris' },
  { lng: 151.2093, lat: -33.8688, intensity: 0.4, type: 'Scanning', city: 'Sydney' },
  { lng: -43.1729, lat: -22.9068, intensity: 0.6, type: 'Botnet', city: 'Rio de Janeiro' },
  { lng: 77.2090, lat: 28.6139, intensity: 0.7, type: 'Ransomware', city: 'Delhi' },
];

interface GeoMapProps {
  className?: string;
}

const GeoMap: React.FC<GeoMapProps> = ({ className = '' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [selectedThreat, setSelectedThreat] = useState<any>(null);

  const initializeMap = (token: string) => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      projection: 'globe' as any,
      zoom: 1.5,
      center: [30, 15],
      pitch: 0,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add atmosphere and fog effects
    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(30, 30, 40)',
        'high-color': 'rgb(50, 50, 70)',
        'horizon-blend': 0.3,
      });

      // Add threat markers
      addThreatMarkers();
    });
  };

  const addThreatMarkers = () => {
    if (!map.current) return;

    threatData.forEach((threat, index) => {
      // Create marker element
      const el = document.createElement('div');
      el.className = 'threat-marker';
      el.style.width = `${20 + threat.intensity * 30}px`;
      el.style.height = `${20 + threat.intensity * 30}px`;
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      
      // Color based on threat intensity
      const color = threat.intensity > 0.7 
        ? 'rgb(239, 68, 68)' // Red for high threats
        : threat.intensity > 0.4
        ? 'rgb(251, 191, 36)' // Yellow for medium threats
        : 'rgb(34, 197, 94)'; // Green for low threats
      
      el.style.backgroundColor = color;
      el.style.opacity = '0.8';
      el.style.border = `2px solid ${color}`;
      el.style.boxShadow = `0 0 20px ${color}`;
      el.style.animation = 'pulse 2s infinite';

      // Add click handler
      el.addEventListener('click', () => {
        setSelectedThreat(threat);
      });

      // Create marker
      new mapboxgl.Marker(el)
        .setLngLat([threat.lng, threat.lat])
        .addTo(map.current!);

      // Add popup on hover
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      }).setHTML(`
        <div class="bg-card p-3 rounded-lg border border-border">
          <h4 class="text-foreground font-semibold">${threat.city}</h4>
          <p class="text-muted-foreground text-sm">Threat: ${threat.type}</p>
          <p class="text-muted-foreground text-sm">Intensity: ${(threat.intensity * 100).toFixed(0)}%</p>
        </div>
      `);

      el.addEventListener('mouseenter', () => {
        popup.setLngLat([threat.lng, threat.lat]).addTo(map.current!);
      });

      el.addEventListener('mouseleave', () => {
        popup.remove();
      });
    });
  };

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setShowTokenInput(false);
      initializeMap(mapboxToken);
    }
  };

  useEffect(() => {
    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, []);

  if (showTokenInput) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <Card className="p-6 bg-card/50 backdrop-blur-sm shadow-card border border-border/50 max-w-md w-full">
          <div className="text-center space-y-4">
            <MapPin className="w-12 h-12 mx-auto text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Configure Mapbox
            </h3>
            <p className="text-muted-foreground text-sm">
              Enter your Mapbox public token to enable the threat map visualization
            </p>
            <div className="space-y-3">
              <Input
                type="text"
                placeholder="pk.ey..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                className="w-full"
              />
              <Button 
                onClick={handleTokenSubmit}
                className="w-full bg-gradient-cyber hover:bg-primary/90"
              >
                Initialize Map
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Get your token from{' '}
              <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                mapbox.com
              </a>
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-96 ${className}`}>
      <div ref={mapContainer} className="absolute inset-0 rounded-lg overflow-hidden" />
      
      {/* Threat Legend */}
      <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm p-3 rounded-lg shadow-card border border-border/50">
        <h4 className="text-sm font-semibold text-foreground mb-2">Threat Levels</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-destructive rounded-full"></div>
            <span className="text-muted-foreground">High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span className="text-muted-foreground">Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-muted-foreground">Low Risk</span>
          </div>
        </div>
      </div>

      {/* Selected Threat Info */}
      {selectedThreat && (
        <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm p-4 rounded-lg shadow-card border border-border/50 max-w-sm">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-foreground">{selectedThreat.city}</h4>
            <button
              onClick={() => setSelectedThreat(null)}
              className="text-muted-foreground hover:text-foreground text-lg leading-none"
            >
              ×
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-destructive" />
              <span className="text-sm">Threat Type: {selectedThreat.type}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm">Intensity: {(selectedThreat.intensity * 100).toFixed(0)}%</span>
            </div>
            <Badge 
              variant={selectedThreat.intensity > 0.7 ? "destructive" : "outline"}
              className="text-xs"
            >
              {selectedThreat.intensity > 0.7 ? "Critical" : "Monitored"}
            </Badge>
          </div>
        </div>
      )}

      {/* CSS for marker animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 1; }
          }
          .threat-marker {
            animation: pulse 2s ease-in-out infinite;
          }
        `
      }} />
    </div>
  );
};

export { GeoMap };