import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  MonitoredLocation,
  LandslideAlert,
  RiskThresholds,
  UserProfile,
  ActivePage,
  SensorStatus
} from '../types';
import {
  INITIAL_LOCATIONS,
  INITIAL_ALERTS,
  DEFAULT_THRESHOLDS,
  INITIAL_USER
} from '../data/mockData';
import { calculateLandslideRisk } from '../utils/aiPrediction';
import { alertAudio } from '../utils/audioAlert';

interface LandSafeContextType {
  user: UserProfile | null;
  login: (role?: 'AUTHORITY' | 'ADMIN' | 'FIELD_ENGINEER') => void;
  logout: () => void;
  locations: MonitoredLocation[];
  alerts: LandslideAlert[];
  thresholds: RiskThresholds;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  selectedLocationId: string;
  setSelectedLocationId: (id: string) => void;
  selectedLocation: MonitoredLocation | undefined;
  
  // Real-time telemetry simulation
  isSimulating: boolean;
  setIsSimulating: (sim: boolean) => void;
  simulationTickCount: number;
  triggerStormSpike: (targetLocId?: string) => void;
  resetToBaseline: () => void;
  
  // Alert actions
  acknowledgeAlert: (alertId: string) => void;
  dispatchAlertTeam: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  broadcastEmergency: (alertId: string) => void;
  emergencyModalAlert: LandslideAlert | null;
  setEmergencyModalAlert: (alert: LandslideAlert | null) => void;
  
  // Admin functions
  addNewLocation: (newLoc: Partial<MonitoredLocation>) => void;
  toggleLocationMonitoring: (locId: string) => void;
  updateThresholds: (newThresh: RiskThresholds) => void;
  
  // Audio state
  isMuted: boolean;
  toggleMute: () => void;
}

const LandSafeContext = createContext<LandSafeContextType | undefined>(undefined);

export const LandSafeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(INITIAL_USER);
  const [locations, setLocations] = useState<MonitoredLocation[]>(INITIAL_LOCATIONS);
  const [alerts, setAlerts] = useState<LandslideAlert[]>(INITIAL_ALERTS);
  const [thresholds, setThresholds] = useState<RiskThresholds>(DEFAULT_THRESHOLDS);
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [selectedLocationId, setSelectedLocationId] = useState<string>(INITIAL_LOCATIONS[0].id);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simulationTickCount, setSimulationTickCount] = useState<number>(0);
  const [emergencyModalAlert, setEmergencyModalAlert] = useState<LandslideAlert | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const selectedLocation = locations.find((l) => l.id === selectedLocationId) || locations[0];

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      alertAudio.setMuted(next);
      return next;
    });
  }, []);

  const login = (role: 'AUTHORITY' | 'ADMIN' | 'FIELD_ENGINEER' = 'AUTHORITY') => {
    if (role === 'ADMIN') {
      setUser({
        id: 'usr-admin-09',
        name: 'Marcus Vance',
        role: 'ADMIN',
        agency: 'System Operations & Sensor Network Command',
        badgeNumber: 'SYS-8891',
        email: 'm.vance@landsafe.gov'
      });
    } else if (role === 'FIELD_ENGINEER') {
      setUser({
        id: 'usr-field-03',
        name: 'Elena Rostova',
        role: 'FIELD_ENGINEER',
        agency: 'Geotechnical Field Telemetry Unit',
        badgeNumber: 'ENG-2104',
        email: 'e.rostova@geotech.org'
      });
    } else {
      setUser(INITIAL_USER);
    }
  };

  const logout = () => {
    setUser(null);
  };

  // Automated tick: Simulates slight environmental perturbations and recalculates AI risk
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setSimulationTickCount((t) => t + 1);
      const currentTimeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setLocations((prevLocations) => {
        let newAlertCandidate: LandslideAlert | null = null;

        const updated = prevLocations.map((loc) => {
          if (!loc.isMonitored) return loc;

          // Minor random telemetry noise
          const rainDelta = (Math.random() - 0.48) * 1.8;
          const moistureDelta = (Math.random() - 0.47) * 0.9;
          const dispDelta = loc.riskScore >= 70 ? Math.max(0, (Math.random() * 0.35)) : (Math.random() - 0.5) * 0.1;
          const pressureDelta = (Math.random() - 0.48) * 1.2;
          const vibrationDelta = (Math.random() - 0.5) * 0.2;

          const newRainfall = Math.max(0, Math.round((loc.currentRainfall + rainDelta) * 10) / 10);
          const newCumulativeRain = Math.round((loc.cumulativeRainfall24h + (newRainfall * (4 / 3600))) * 10) / 10;
          const newMoisture = Math.min(99, Math.max(15, Math.round((loc.soilMoisture + moistureDelta) * 10) / 10));
          const newDisp = Math.max(0, Math.round((loc.groundDisplacement + dispDelta) * 10) / 10);
          const newPressure = Math.max(2, Math.round((loc.soilPressure + pressureDelta) * 10) / 10);
          const newVibration = Math.max(0.1, Math.round((loc.vibrationIntensity + vibrationDelta) * 10) / 10);

          // Re-run AI calculation
          const prediction = calculateLandslideRisk({
            rainfallIntensity: newRainfall,
            soilMoisture: newMoisture,
            slopeAngle: loc.slopeAngle,
            groundDisplacement: newDisp,
            soilPressure: newPressure,
            temperature: loc.temperature,
            historicalIncidentsCount: loc.incidents.length,
            soilType: loc.soilType
          });

          // Update sensors
          const updatedSensors = loc.sensors.map((s) => {
            let val = s.value;
            let status: SensorStatus = s.status;

            if (s.type === 'RAINFALL') {
              val = newRainfall;
              status = val >= thresholds.maxRainfallMmH ? 'WARNING' : 'ONLINE';
            } else if (s.type === 'SOIL_MOISTURE') {
              val = newMoisture;
              status = val >= thresholds.maxSoilMoisturePercent ? 'WARNING' : 'ONLINE';
            } else if (s.type === 'GROUND_MOVEMENT') {
              val = newDisp;
              status = val >= thresholds.maxDisplacementMm ? 'WARNING' : 'ONLINE';
            } else if (s.type === 'SOIL_PRESSURE') {
              val = newPressure;
              status = val >= 50 ? 'WARNING' : 'ONLINE';
            } else if (s.type === 'VIBRATION') {
              val = newVibration;
              status = val >= 4.0 ? 'WARNING' : 'ONLINE';
            }

            return {
              ...s,
              value: val,
              status,
              lastReported: currentTimeString
            };
          });

          // Append to historical trend (keep last 15 points)
          const newTrendPoint = {
            timestamp: currentTimeString,
            rainfall: newRainfall,
            soilMoisture: newMoisture,
            displacement: newDisp,
            riskScore: prediction.riskScore
          };
          const trimmedTrend = [...loc.historicalTrend.slice(-14), newTrendPoint];

          // Check if crossed threshold into critical/high and previous was lower
          if (
            (prediction.riskLevel === 'CRITICAL' || prediction.riskLevel === 'HIGH') &&
            loc.riskScore < thresholds.highRiskScore &&
            prediction.riskScore >= thresholds.highRiskScore
          ) {
            newAlertCandidate = {
              id: `alt-live-${Date.now()}`,
              locationId: loc.id,
              locationName: loc.name,
              region: loc.region,
              timestamp: currentTimeString,
              riskScore: prediction.riskScore,
              riskLevel: prediction.riskLevel,
              cause: `Sensor threshold breached: Rain ${newRainfall} mm/h, Moisture ${newMoisture}%, Displacement ${newDisp} mm`,
              recommendedAction: prediction.safetyRecommendation,
              status: prediction.riskLevel === 'CRITICAL' ? 'CRITICAL_ACTIVE' : 'HIGH_ACTIVE',
              broadcastSent: false,
              evacuationTriggered: prediction.riskLevel === 'CRITICAL'
            };
          }

          return {
            ...loc,
            currentRainfall: newRainfall,
            cumulativeRainfall24h: newCumulativeRain,
            soilMoisture: newMoisture,
            groundDisplacement: newDisp,
            soilPressure: newPressure,
            vibrationIntensity: newVibration,
            riskScore: prediction.riskScore,
            riskLevel: prediction.riskLevel,
            factorOfSafety: prediction.factorOfSafety,
            predictionConfidence: prediction.confidence,
            aiExplanation: prediction.explanation,
            contributingFactors: prediction.contributingFactors,
            safetyRecommendation: prediction.safetyRecommendation,
            lastUpdated: currentTimeString,
            sensors: updatedSensors,
            historicalTrend: trimmedTrend
          };
        });

        if (newAlertCandidate) {
          const candidate = newAlertCandidate as LandslideAlert;
          setAlerts((curr) => [candidate, ...curr]);
          setEmergencyModalAlert(candidate);
          alertAudio.playWarningBeep(candidate.riskLevel === 'CRITICAL' ? 'CRITICAL' : 'HIGH');
        }

        return updated;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isSimulating, thresholds]);

  // Hackathon demo button: Triggers extreme storm on Hill Zone A or selected location
  const triggerStormSpike = (targetLocId?: string) => {
    const id = targetLocId || selectedLocationId || 'loc-hill-zone-a';
    const currentTimeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    setLocations((prev) =>
      prev.map((loc) => {
        if (loc.id === id) {
          const newRainfall = 64.5; // extreme cloudburst
          const newMoisture = 94.0;
          const newDisp = Math.round((loc.groundDisplacement + 6.8) * 10) / 10;
          const newPressure = 72.5;

          const prediction = calculateLandslideRisk({
            rainfallIntensity: newRainfall,
            soilMoisture: newMoisture,
            slopeAngle: loc.slopeAngle,
            groundDisplacement: newDisp,
            soilPressure: newPressure,
            temperature: loc.temperature,
            historicalIncidentsCount: loc.incidents.length,
            soilType: loc.soilType
          });

          const newAlert: LandslideAlert = {
            id: `alt-storm-${Date.now()}`,
            locationId: loc.id,
            locationName: loc.name,
            region: loc.region,
            timestamp: currentTimeString,
            riskScore: prediction.riskScore,
            riskLevel: prediction.riskLevel,
            cause: `⚠ EXTREME STORM SURGE: Cloudburst (64.5 mm/h) + Rapid displacement spike (+6.8mm) in ${loc.name}`,
            recommendedAction: 'RED ALERT: Evacuate slope sector immediately. Civil defense siren dispatched.',
            status: 'CRITICAL_ACTIVE',
            broadcastSent: true,
            evacuationTriggered: true
          };

          setAlerts((curr) => [newAlert, ...curr]);
          setEmergencyModalAlert(newAlert);
          alertAudio.playWarningBeep('CRITICAL');

          return {
            ...loc,
            currentRainfall: newRainfall,
            cumulativeRainfall24h: loc.cumulativeRainfall24h + 25,
            soilMoisture: newMoisture,
            groundDisplacement: newDisp,
            soilPressure: newPressure,
            vibrationIntensity: 5.8,
            riskScore: prediction.riskScore,
            riskLevel: prediction.riskLevel,
            factorOfSafety: prediction.factorOfSafety,
            aiExplanation: prediction.explanation,
            contributingFactors: prediction.contributingFactors,
            safetyRecommendation: prediction.safetyRecommendation,
            lastUpdated: currentTimeString
          };
        }
        return loc;
      })
    );
  };

  // Reset simulation back to initial stable baseline
  const resetToBaseline = () => {
    setLocations(INITIAL_LOCATIONS);
    setAlerts(INITIAL_ALERTS);
    setEmergencyModalAlert(null);
  };

  // Alert management
  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'ACKNOWLEDGED' } : a))
    );
  };

  const dispatchAlertTeam = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'DISPATCHED' } : a))
    );
  };

  const resolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'RESOLVED' } : a))
    );
  };

  const broadcastEmergency = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, broadcastSent: true, evacuationTriggered: true } : a))
    );
    alertAudio.playWarningBeep('CRITICAL');
  };

  // Admin controls
  const addNewLocation = (newLocData: Partial<MonitoredLocation>) => {
    const id = `loc-custom-${Date.now()}`;
    const lat = newLocData.latitude || 18.54;
    const lng = newLocData.longitude || 73.82;
    const name = newLocData.name || 'New Survey Sector';
    const slope = newLocData.slopeAngle || 30;
    const rain = newLocData.currentRainfall || 12;
    const moist = newLocData.soilMoisture || 45;
    const disp = newLocData.groundDisplacement || 2.0;
    const currentTimeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const prediction = calculateLandslideRisk({
      rainfallIntensity: rain,
      soilMoisture: moist,
      slopeAngle: slope,
      groundDisplacement: disp,
      soilPressure: 20,
      temperature: 20,
      historicalIncidentsCount: 0,
      soilType: newLocData.soilType || 'Gravel & Sand'
    });

    const newLoc: MonitoredLocation = {
      id,
      name,
      region: newLocData.region || 'Regional Sector',
      latitude: lat,
      longitude: lng,
      elevation: newLocData.elevation || 800,
      slopeAngle: slope,
      soilType: newLocData.soilType || 'Gravelly Clay Silt',
      populationAtRisk: newLocData.populationAtRisk || 500,
      isMonitored: true,
      currentRainfall: rain,
      cumulativeRainfall24h: 30,
      soilMoisture: moist,
      groundDisplacement: disp,
      displacementRate: 0.1,
      soilPressure: 20,
      vibrationIntensity: 0.5,
      temperature: 21,
      humidity: 75,
      riskScore: prediction.riskScore,
      riskLevel: prediction.riskLevel,
      predictionConfidence: prediction.confidence,
      factorOfSafety: prediction.factorOfSafety,
      aiExplanation: prediction.explanation,
      contributingFactors: prediction.contributingFactors,
      safetyRecommendation: prediction.safetyRecommendation,
      lastUpdated: currentTimeString,
      sensors: [
        { id: `sn-${id}-1`, name: 'Rainfall Sensor', type: 'RAINFALL', value: rain, unit: 'mm/h', status: 'ONLINE', batteryLevel: 98, signalStrength: -62, lastReported: currentTimeString, normalRange: [0, 25], alertThreshold: 45 },
        { id: `sn-${id}-2`, name: 'Soil Moisture Sensor', type: 'SOIL_MOISTURE', value: moist, unit: '%', status: 'ONLINE', batteryLevel: 95, signalStrength: -65, lastReported: currentTimeString, normalRange: [20, 65], alertThreshold: 75 },
        { id: `sn-${id}-3`, name: 'Inclinometer', type: 'GROUND_MOVEMENT', value: disp, unit: 'mm', status: 'ONLINE', batteryLevel: 90, signalStrength: -70, lastReported: currentTimeString, normalRange: [0, 5], alertThreshold: 12 },
        { id: `sn-${id}-4`, name: 'Piezometer', type: 'SOIL_PRESSURE', value: 20, unit: 'kPa', status: 'ONLINE', batteryLevel: 92, signalStrength: -67, lastReported: currentTimeString, normalRange: [5, 30], alertThreshold: 50 },
        { id: `sn-${id}-5`, name: 'Vibration Geophone', type: 'VIBRATION', value: 0.5, unit: 'mm/s', status: 'ONLINE', batteryLevel: 97, signalStrength: -60, lastReported: currentTimeString, normalRange: [0, 2], alertThreshold: 4.0 }
      ],
      incidents: [],
      historicalTrend: [
        { timestamp: '12:00', rainfall: rain, soilMoisture: moist, displacement: disp, riskScore: prediction.riskScore }
      ]
    };

    setLocations((prev) => [newLoc, ...prev]);
    setSelectedLocationId(id);
  };

  const toggleLocationMonitoring = (locId: string) => {
    setLocations((prev) =>
      prev.map((l) => (l.id === locId ? { ...l, isMonitored: !l.isMonitored } : l))
    );
  };

  const updateThresholds = (newThresh: RiskThresholds) => {
    setThresholds(newThresh);
  };

  return (
    <LandSafeContext.Provider
      value={{
        user,
        login,
        logout,
        locations,
        alerts,
        thresholds,
        activePage,
        setActivePage,
        selectedLocationId,
        setSelectedLocationId,
        selectedLocation,
        isSimulating,
        setIsSimulating,
        simulationTickCount,
        triggerStormSpike,
        resetToBaseline,
        acknowledgeAlert,
        dispatchAlertTeam,
        resolveAlert,
        broadcastEmergency,
        emergencyModalAlert,
        setEmergencyModalAlert,
        addNewLocation,
        toggleLocationMonitoring,
        updateThresholds,
        isMuted,
        toggleMute
      }}
    >
      {children}
    </LandSafeContext.Provider>
  );
};

export const useLandSafe = () => {
  const context = useContext(LandSafeContext);
  if (!context) {
    throw new Error('useLandSafe must be used within a LandSafeProvider');
  }
  return context;
};
