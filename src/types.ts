export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type SensorStatus = 'ONLINE' | 'WARNING' | 'OFFLINE';

export type SensorType = 
  | 'RAINFALL' 
  | 'SOIL_MOISTURE' 
  | 'GROUND_MOVEMENT' 
  | 'SOIL_PRESSURE' 
  | 'VIBRATION';

export interface SensorDevice {
  id: string;
  name: string;
  type: SensorType;
  value: number;
  unit: string;
  status: SensorStatus;
  batteryLevel: number; // 0 - 100
  signalStrength: number; // dBm e.g. -65
  lastReported: string;
  normalRange: [number, number];
  alertThreshold: number;
}

export interface LandslideIncident {
  id: string;
  year: number;
  date: string;
  severity: 'MINOR' | 'MODERATE' | 'SEVERE';
  rainfallTrigger: number; // mm in 24h
  damageReport: string;
  evacuatedPeople: number;
}

export interface MonitoredLocation {
  id: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  elevation: number; // in meters
  slopeAngle: number; // degrees e.g. 35°
  soilType: string; // e.g. 'Saturated Clay Loam', 'Weathered Schist'
  populationAtRisk: number;
  isMonitored: boolean;
  
  // Real-time environmental metrics
  currentRainfall: number; // mm/h
  cumulativeRainfall24h: number; // mm
  soilMoisture: number; // percentage % (0-100)
  groundDisplacement: number; // mm
  displacementRate: number; // mm/hr
  soilPressure: number; // kPa
  vibrationIntensity: number; // mm/s (PPV)
  temperature: number; // °C
  humidity: number; // %
  
  // AI Prediction state
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  predictionConfidence: number; // 0 - 100%
  factorOfSafety: number; // FoS e.g. 1.05 (<1.0 is failure)
  aiExplanation: string;
  contributingFactors: {
    factor: string;
    weight: number; // percentage impact
    status: 'NORMAL' | 'ELEVATED' | 'CRITICAL';
    detail: string;
  }[];
  safetyRecommendation: string;
  lastUpdated: string;
  
  // Sensors assigned to this site
  sensors: SensorDevice[];
  
  // Historical data
  incidents: LandslideIncident[];
  historicalTrend: {
    timestamp: string;
    rainfall: number;
    soilMoisture: number;
    displacement: number;
    riskScore: number;
  }[];
}

export interface LandslideAlert {
  id: string;
  locationId: string;
  locationName: string;
  region: string;
  timestamp: string;
  riskScore: number;
  riskLevel: RiskLevel;
  cause: string;
  recommendedAction: string;
  status: 'CRITICAL_ACTIVE' | 'HIGH_ACTIVE' | 'ACKNOWLEDGED' | 'DISPATCHED' | 'RESOLVED';
  broadcastSent: boolean;
  evacuationTriggered: boolean;
}

export interface RiskThresholds {
  criticalRiskScore: number; // default 85
  highRiskScore: number; // default 70
  moderateRiskScore: number; // default 40
  maxRainfallMmH: number; // default 45 mm/h
  maxSoilMoisturePercent: number; // default 75%
  maxDisplacementMm: number; // default 15 mm
}

export interface UserProfile {
  id: string;
  name: string;
  role: 'AUTHORITY' | 'ADMIN' | 'FIELD_ENGINEER';
  agency: string;
  badgeNumber: string;
  email: string;
}

export type ActivePage = 
  | 'login'
  | 'dashboard'
  | 'map'
  | 'live-map'
  | 'ai-prediction'
  | 'sensors'
  | 'early-warning'
  | 'alerts'
  | 'analytics'
  | 'locations'
  | 'admin';
