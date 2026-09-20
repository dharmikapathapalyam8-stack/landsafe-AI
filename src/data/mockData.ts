import { MonitoredLocation, LandslideAlert, RiskThresholds, UserProfile } from '../types';
import { calculateLandslideRisk } from '../utils/aiPrediction';

export const DEFAULT_THRESHOLDS: RiskThresholds = {
  criticalRiskScore: 85,
  highRiskScore: 70,
  moderateRiskScore: 40,
  maxRainfallMmH: 45,
  maxSoilMoisturePercent: 75,
  maxDisplacementMm: 12
};

export const INITIAL_USER: UserProfile = {
  id: 'usr-dmc-01',
  name: 'Dr. Sarah Althaus',
  role: 'AUTHORITY',
  agency: 'National Disaster Risk Reduction & Geotechnical Survey',
  badgeNumber: 'NDMC-4482',
  email: 's.althaus@disaster-mgmt.gov'
};

const now = new Date();
const timeStr = (minsAgo: number) => {
  const d = new Date(now.getTime() - minsAgo * 60 * 1000);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

// Generate 24h sample time-series data for a location
function generateHistoricalTrend(baseRisk: number, baseRain: number, baseMoisture: number, baseDisp: number) {
  const points = [];
  for (let i = 12; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 2 * 3600 * 1000);
    const hourLabel = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const wave = Math.sin(i * 0.5);
    const rain = Math.max(0, Math.round((baseRain + wave * 8 + (12 - i) * 1.5) * 10) / 10);
    const moisture = Math.min(98, Math.max(20, Math.round(baseMoisture + wave * 4 + (12 - i) * 1.2)));
    const disp = Math.max(0, Math.round((baseDisp + (12 - i) * 0.7) * 10) / 10);
    const risk = Math.min(100, Math.max(10, Math.round(baseRisk + wave * 6 + (12 - i) * 1.8)));

    points.push({
      timestamp: hourLabel,
      rainfall: rain,
      soilMoisture: moisture,
      displacement: disp,
      riskScore: risk
    });
  }
  return points;
}

export const INITIAL_LOCATIONS: MonitoredLocation[] = [
  {
    id: 'loc-hill-zone-a',
    name: 'Hill Zone A - Pine Ridge Crest',
    region: 'Highland Sector Alpha',
    latitude: 18.5204,
    longitude: 73.8567,
    elevation: 1240,
    slopeAngle: 42,
    soilType: 'Saturated Colluvial Clay Loam',
    populationAtRisk: 1420,
    isMonitored: true,
    currentRainfall: 52.4,
    cumulativeRainfall24h: 184.6,
    soilMoisture: 88,
    groundDisplacement: 18.6,
    displacementRate: 2.4,
    soilPressure: 64.2,
    vibrationIntensity: 4.8,
    temperature: 17.8,
    humidity: 96,
    riskScore: 88,
    riskLevel: 'CRITICAL',
    predictionConfidence: 94,
    factorOfSafety: 0.84,
    aiExplanation: 'CRITICAL HAZARD: Intense rainfall (52.4 mm/h) coupled with extreme soil pore saturation (88%) has triggered accelerated ground displacement of 18.6 mm. Shear resistance has dropped below critical equilibrium (FoS 0.84). Immediate downslope debris flow likely.',
    contributingFactors: [
      { factor: 'Rainfall Intensity', weight: 34, status: 'CRITICAL', detail: '52.4 mm/h cloudburst cloud peak' },
      { factor: 'Soil Saturation', weight: 26, status: 'CRITICAL', detail: '88% pore saturation reaching liquefaction limit' },
      { factor: 'Ground Displacement', weight: 24, status: 'CRITICAL', detail: '18.6 mm slip detected by shear inclinometer' },
      { factor: 'Slope Gradient', weight: 16, status: 'CRITICAL', detail: '42° steep vulnerable angle' }
    ],
    safetyRecommendation: 'IMMEDIATE EVACUATION ORDER: Sound emergency community sirens in Pine Ridge Hamlet, close Route 7 pass, and relocate 1,420 residents to High School Shelter Point B.',
    lastUpdated: timeStr(1),
    sensors: [
      { id: 'sn-hza-01', name: 'Optical Pluviometer Rain Gauge A1', type: 'RAINFALL', value: 52.4, unit: 'mm/h', status: 'WARNING', batteryLevel: 91, signalStrength: -68, lastReported: timeStr(1), normalRange: [0, 25], alertThreshold: 45 },
      { id: 'sn-hza-02', name: 'Deep TDR Soil Moisture Array M1', type: 'SOIL_MOISTURE', value: 88, unit: '%', status: 'WARNING', batteryLevel: 87, signalStrength: -72, lastReported: timeStr(1), normalRange: [20, 65], alertThreshold: 75 },
      { id: 'sn-hza-03', name: 'Borehole Inclinometer / Shear Gauge D1', type: 'GROUND_MOVEMENT', value: 18.6, unit: 'mm', status: 'WARNING', batteryLevel: 94, signalStrength: -65, lastReported: timeStr(1), normalRange: [0, 5], alertThreshold: 12 },
      { id: 'sn-hza-04', name: 'Vibrating Wire Piezometer P1', type: 'SOIL_PRESSURE', value: 64.2, unit: 'kPa', status: 'WARNING', batteryLevel: 82, signalStrength: -79, lastReported: timeStr(2), normalRange: [5, 30], alertThreshold: 50 },
      { id: 'sn-hza-05', name: 'Triaxial Seismic Geophone V1', type: 'VIBRATION', value: 4.8, unit: 'mm/s', status: 'ONLINE', batteryLevel: 96, signalStrength: -62, lastReported: timeStr(1), normalRange: [0, 2], alertThreshold: 4.0 }
    ],
    incidents: [
      { id: 'inc-hza-2021', year: 2021, date: '14 Aug 2021', severity: 'SEVERE', rainfallTrigger: 210, damageReport: 'Debris slide blocked State Highway 9; 3 outbuildings swept away.', evacuatedPeople: 480 },
      { id: 'inc-hza-2018', year: 2018, date: '29 Jul 2018', severity: 'MODERATE', rainfallTrigger: 165, damageReport: 'Minor mudflow deposited 2 meters of silt over farm access road.', evacuatedPeople: 120 }
    ],
    historicalTrend: generateHistoricalTrend(88, 52, 88, 18.6)
  },
  {
    id: 'loc-north-ridge-12',
    name: 'Northern Ridge Highway 12 Cut',
    region: 'North Corridor',
    latitude: 18.6110,
    longitude: 73.7420,
    elevation: 980,
    slopeAngle: 38,
    soilType: 'Weathered Basalt & Silt Overburden',
    populationAtRisk: 860,
    isMonitored: true,
    currentRainfall: 38.6,
    cumulativeRainfall24h: 132.0,
    soilMoisture: 79,
    groundDisplacement: 11.2,
    displacementRate: 1.1,
    soilPressure: 48.0,
    vibrationIntensity: 2.3,
    temperature: 19.4,
    humidity: 91,
    riskScore: 76,
    riskLevel: 'HIGH',
    predictionConfidence: 91,
    factorOfSafety: 1.08,
    aiExplanation: 'HIGH RISK: Continuous moderate downpour (38.6 mm/h) and escalating pore water pressure (48.0 kPa) have initiated tension crack displacement of 11.2 mm along the artificial road cut. Slope approaching limit equilibrium.',
    contributingFactors: [
      { factor: 'Soil Saturation', weight: 32, status: 'CRITICAL', detail: '79% moisture with weak overburden' },
      { factor: 'Rainfall Intensity', weight: 28, status: 'ELEVATED', detail: '38.6 mm/h steady monsoon band' },
      { factor: 'Ground Displacement', weight: 22, status: 'ELEVATED', detail: '11.2 mm cumulative displacement' },
      { factor: 'Slope Gradient', weight: 18, status: 'ELEVATED', detail: '38° cut angle with unreinforced bench' }
    ],
    safetyRecommendation: 'HIGH RISK ALERT: Restrict Highway 12 to emergency vehicles only. Deploy spotters with optical prism telemetry. Prepare barrier catch-net deployers.',
    lastUpdated: timeStr(2),
    sensors: [
      { id: 'sn-nrh-01', name: 'Rainfall Gauge N1', type: 'RAINFALL', value: 38.6, unit: 'mm/h', status: 'WARNING', batteryLevel: 89, signalStrength: -71, lastReported: timeStr(2), normalRange: [0, 25], alertThreshold: 45 },
      { id: 'sn-nrh-02', name: 'Soil Moisture Probe N2', type: 'SOIL_MOISTURE', value: 79, unit: '%', status: 'WARNING', batteryLevel: 92, signalStrength: -67, lastReported: timeStr(2), normalRange: [20, 65], alertThreshold: 75 },
      { id: 'sn-nrh-03', name: 'Roadcut Laser Extensometer N3', type: 'GROUND_MOVEMENT', value: 11.2, unit: 'mm', status: 'WARNING', batteryLevel: 78, signalStrength: -83, lastReported: timeStr(3), normalRange: [0, 5], alertThreshold: 12 },
      { id: 'sn-nrh-04', name: 'Pore Pressure Transducer N4', type: 'SOIL_PRESSURE', value: 48.0, unit: 'kPa', status: 'ONLINE', batteryLevel: 84, signalStrength: -74, lastReported: timeStr(2), normalRange: [5, 30], alertThreshold: 50 },
      { id: 'sn-nrh-05', name: 'Micro-seismic Sensor N5', type: 'VIBRATION', value: 2.3, unit: 'mm/s', status: 'ONLINE', batteryLevel: 95, signalStrength: -60, lastReported: timeStr(2), normalRange: [0, 2], alertThreshold: 4.0 }
    ],
    incidents: [
      { id: 'inc-nrh-2023', year: 2023, date: '11 Sep 2023', severity: 'MODERATE', rainfallTrigger: 140, damageReport: 'Rockfall crushed road guardrails; lane closed for 72 hours.', evacuatedPeople: 0 }
    ],
    historicalTrend: generateHistoricalTrend(76, 38, 79, 11.2)
  },
  {
    id: 'loc-valley-pass-4',
    name: 'Valley Pass Sector 4 - River Basin',
    region: 'Eastern Valley',
    latitude: 18.4350,
    longitude: 73.9100,
    elevation: 640,
    slopeAngle: 28,
    soilType: 'Alluvial Sandy Gravel & Silt',
    populationAtRisk: 2100,
    isMonitored: true,
    currentRainfall: 22.0,
    cumulativeRainfall24h: 74.5,
    soilMoisture: 62,
    groundDisplacement: 4.6,
    displacementRate: 0.3,
    soilPressure: 28.5,
    vibrationIntensity: 1.1,
    temperature: 22.1,
    humidity: 84,
    riskScore: 54,
    riskLevel: 'MODERATE',
    predictionConfidence: 92,
    factorOfSafety: 1.42,
    aiExplanation: 'MODERATE RISK: Moderate precipitation (22.0 mm/h) has elevated soil moisture to 62%. Ground displacement remains low (4.6 mm) but localized saturation near river embankment requires vigilant monitoring.',
    contributingFactors: [
      { factor: 'Soil Saturation', weight: 35, status: 'NORMAL', detail: '62% manageable moisture' },
      { factor: 'Rainfall Intensity', weight: 30, status: 'NORMAL', detail: '22.0 mm/h steady shower' },
      { factor: 'Slope Gradient', weight: 20, status: 'NORMAL', detail: '28° gentle concave slope' },
      { factor: 'Ground Displacement', weight: 15, status: 'NORMAL', detail: '4.6 mm seasonal settlement' }
    ],
    safetyRecommendation: 'ADVISORY MONITORING: Inspect river culverts, keep stormwater diversion channels clear, and update regional emergency radio broadcast.',
    lastUpdated: timeStr(3),
    sensors: [
      { id: 'sn-vp4-01', name: 'Pluviometer V1', type: 'RAINFALL', value: 22.0, unit: 'mm/h', status: 'ONLINE', batteryLevel: 94, signalStrength: -62, lastReported: timeStr(3), normalRange: [0, 25], alertThreshold: 45 },
      { id: 'sn-vp4-02', name: 'Soil Moisture Array V2', type: 'SOIL_MOISTURE', value: 62, unit: '%', status: 'ONLINE', batteryLevel: 90, signalStrength: -68, lastReported: timeStr(3), normalRange: [20, 65], alertThreshold: 75 },
      { id: 'sn-vp4-03', name: 'Surface Inclinometer V3', type: 'GROUND_MOVEMENT', value: 4.6, unit: 'mm', status: 'ONLINE', batteryLevel: 86, signalStrength: -75, lastReported: timeStr(3), normalRange: [0, 5], alertThreshold: 12 },
      { id: 'sn-vp4-04', name: 'Pore Pressure Cell V4', type: 'SOIL_PRESSURE', value: 28.5, unit: 'kPa', status: 'ONLINE', batteryLevel: 88, signalStrength: -70, lastReported: timeStr(4), normalRange: [5, 30], alertThreshold: 50 },
      { id: 'sn-vp4-05', name: 'Seismic Geophone V5', type: 'VIBRATION', value: 1.1, unit: 'mm/s', status: 'ONLINE', batteryLevel: 97, signalStrength: -58, lastReported: timeStr(3), normalRange: [0, 2], alertThreshold: 4.0 }
    ],
    incidents: [
      { id: 'inc-vp4-2019', year: 2019, date: '04 Oct 2019', severity: 'MINOR', rainfallTrigger: 95, damageReport: 'Embankment wash-away near footbridge.', evacuatedPeople: 40 }
    ],
    historicalTrend: generateHistoricalTrend(54, 22, 62, 4.6)
  },
  {
    id: 'loc-emerald-valley',
    name: 'Emerald Valley Settlement Slopes',
    region: 'Western Ghats Ridge',
    latitude: 18.5820,
    longitude: 73.7950,
    elevation: 890,
    slopeAngle: 32,
    soilType: 'Laterite & Weathered Lithomarge',
    populationAtRisk: 1650,
    isMonitored: true,
    currentRainfall: 19.5,
    cumulativeRainfall24h: 88.0,
    soilMoisture: 58,
    groundDisplacement: 3.8,
    displacementRate: 0.2,
    soilPressure: 24.0,
    vibrationIntensity: 0.8,
    temperature: 20.8,
    humidity: 86,
    riskScore: 48,
    riskLevel: 'MODERATE',
    predictionConfidence: 93,
    factorOfSafety: 1.55,
    aiExplanation: 'MODERATE RISK: Current rainfall and soil moisture are within manageable bounds. Slope angle is moderate. Inclinometers show minor ground shift from natural thermal expansion.',
    contributingFactors: [
      { factor: 'Slope Gradient', weight: 32, status: 'NORMAL', detail: '32° incline with terrace cultivation' },
      { factor: 'Soil Saturation', weight: 30, status: 'NORMAL', detail: '58% moderate hydration' },
      { factor: 'Rainfall Intensity', weight: 26, status: 'NORMAL', detail: '19.5 mm/h intermittent rainfall' },
      { factor: 'Ground Displacement', weight: 12, status: 'NORMAL', detail: '3.8 mm stable baseline' }
    ],
    safetyRecommendation: 'REGULAR OBSERVATION: Check drainage swales and retain regular 30-min data transmission. No evacuation required.',
    lastUpdated: timeStr(2),
    sensors: [
      { id: 'sn-evs-01', name: 'Rainfall Sensor E1', type: 'RAINFALL', value: 19.5, unit: 'mm/h', status: 'ONLINE', batteryLevel: 93, signalStrength: -64, lastReported: timeStr(2), normalRange: [0, 25], alertThreshold: 45 },
      { id: 'sn-evs-02', name: 'Soil Moisture Sensor E2', type: 'SOIL_MOISTURE', value: 58, unit: '%', status: 'ONLINE', batteryLevel: 91, signalStrength: -69, lastReported: timeStr(2), normalRange: [20, 65], alertThreshold: 75 },
      { id: 'sn-evs-03', name: 'Borehole Extensometer E3', type: 'GROUND_MOVEMENT', value: 3.8, unit: 'mm', status: 'ONLINE', batteryLevel: 88, signalStrength: -72, lastReported: timeStr(2), normalRange: [0, 5], alertThreshold: 12 },
      { id: 'sn-evs-04', name: 'Piezometer E4', type: 'SOIL_PRESSURE', value: 24.0, unit: 'kPa', status: 'ONLINE', batteryLevel: 85, signalStrength: -77, lastReported: timeStr(3), normalRange: [5, 30], alertThreshold: 50 },
      { id: 'sn-evs-05', name: 'Vibration Geophone E5', type: 'VIBRATION', value: 0.8, unit: 'mm/s', status: 'ONLINE', batteryLevel: 95, signalStrength: -61, lastReported: timeStr(2), normalRange: [0, 2], alertThreshold: 4.0 }
    ],
    incidents: [
      { id: 'inc-evs-2020', year: 2020, date: '21 Jun 2020', severity: 'MINOR', rainfallTrigger: 110, damageReport: 'Terraced wall collapse without human casualties.', evacuatedPeople: 15 }
    ],
    historicalTrend: generateHistoricalTrend(48, 19.5, 58, 3.8)
  },
  {
    id: 'loc-mount-solitude',
    name: 'Mount Solitude Tea Estate Escarpment',
    region: 'Southern Range',
    latitude: 18.4850,
    longitude: 73.8120,
    elevation: 1410,
    slopeAngle: 22,
    soilType: 'Dense Granitic Gneiss with Deep Vegetative Root Mat',
    populationAtRisk: 420,
    isMonitored: true,
    currentRainfall: 6.2,
    cumulativeRainfall24h: 21.0,
    soilMoisture: 38,
    groundDisplacement: 1.2,
    displacementRate: 0.05,
    soilPressure: 12.4,
    vibrationIntensity: 0.4,
    temperature: 16.5,
    humidity: 71,
    riskScore: 22,
    riskLevel: 'LOW',
    predictionConfidence: 96,
    factorOfSafety: 2.15,
    aiExplanation: 'LOW RISK: Excellent slope stability (FoS 2.15). Deep root interlocking from tea and eucalyptus plantations reinforces topsoil. Pore pressures and ground displacement are completely nominal.',
    contributingFactors: [
      { factor: 'Geological Root Mat', weight: 40, status: 'NORMAL', detail: 'Dense root binding provides strong effective cohesion' },
      { factor: 'Low Precipitation', weight: 28, status: 'NORMAL', detail: '6.2 mm/h light drizzle' },
      { factor: 'Stable Ground', weight: 20, status: 'NORMAL', detail: '1.2 mm baseline' },
      { factor: 'Gentle Slope', weight: 12, status: 'NORMAL', detail: '22° gentle slope' }
    ],
    safetyRecommendation: 'NORMAL SAFE STATUS: All geotechnical parameters within standard operating tolerances. Continue standard telemetric cycle.',
    lastUpdated: timeStr(1),
    sensors: [
      { id: 'sn-mst-01', name: 'Rainfall Sensor S1', type: 'RAINFALL', value: 6.2, unit: 'mm/h', status: 'ONLINE', batteryLevel: 98, signalStrength: -59, lastReported: timeStr(1), normalRange: [0, 25], alertThreshold: 45 },
      { id: 'sn-mst-02', name: 'Soil Moisture Sensor S2', type: 'SOIL_MOISTURE', value: 38, unit: '%', status: 'ONLINE', batteryLevel: 96, signalStrength: -62, lastReported: timeStr(1), normalRange: [20, 65], alertThreshold: 75 },
      { id: 'sn-mst-03', name: 'Inclinometer S3', type: 'GROUND_MOVEMENT', value: 1.2, unit: 'mm', status: 'ONLINE', batteryLevel: 92, signalStrength: -66, lastReported: timeStr(1), normalRange: [0, 5], alertThreshold: 12 },
      { id: 'sn-mst-04', name: 'Piezometer S4', type: 'SOIL_PRESSURE', value: 12.4, unit: 'kPa', status: 'ONLINE', batteryLevel: 94, signalStrength: -63, lastReported: timeStr(2), normalRange: [5, 30], alertThreshold: 50 },
      { id: 'sn-mst-05', name: 'Vibration Geophone S5', type: 'VIBRATION', value: 0.4, unit: 'mm/s', status: 'ONLINE', batteryLevel: 99, signalStrength: -55, lastReported: timeStr(1), normalRange: [0, 2], alertThreshold: 4.0 }
    ],
    incidents: [],
    historicalTrend: generateHistoricalTrend(22, 6.2, 38, 1.2)
  },
  {
    id: 'loc-cedar-creek',
    name: 'Cedar Creek Engineered Retaining Wall',
    region: 'Southwest Valley',
    latitude: 18.4510,
    longitude: 73.8820,
    elevation: 720,
    slopeAngle: 25,
    soilType: 'Engineered Soil with Anchored Gabion Baskets',
    populationAtRisk: 310,
    isMonitored: true,
    currentRainfall: 4.5,
    cumulativeRainfall24h: 16.2,
    soilMoisture: 32,
    groundDisplacement: 0.8,
    displacementRate: 0.02,
    soilPressure: 10.1,
    vibrationIntensity: 0.3,
    temperature: 23.4,
    humidity: 68,
    riskScore: 16,
    riskLevel: 'LOW',
    predictionConfidence: 97,
    factorOfSafety: 2.45,
    aiExplanation: 'LOW RISK: Engineered gabion retaining walls and sub-horizontal weep hole drains ensure zero hydrostatic buildup. Ground displacement is 0.8 mm (pure thermal drift).',
    contributingFactors: [
      { factor: 'Engineered Drainage', weight: 45, status: 'NORMAL', detail: 'Weep hole drainage working at 100% capacity' },
      { factor: 'Low Saturation', weight: 25, status: 'NORMAL', detail: '32% moisture' },
      { factor: 'Minimal Rain', weight: 20, status: 'NORMAL', detail: '4.5 mm/h light mist' },
      { factor: 'Rock Anchor Support', weight: 10, status: 'NORMAL', detail: 'Tension anchors stable' }
    ],
    safetyRecommendation: 'NORMAL SAFE STATUS: Retaining wall performing normally. Next physical engineering inspection scheduled in 6 months.',
    lastUpdated: timeStr(2),
    sensors: [
      { id: 'sn-cc-01', name: 'Rainfall Sensor C1', type: 'RAINFALL', value: 4.5, unit: 'mm/h', status: 'ONLINE', batteryLevel: 96, signalStrength: -60, lastReported: timeStr(2), normalRange: [0, 25], alertThreshold: 45 },
      { id: 'sn-cc-02', name: 'Soil Moisture Sensor C2', type: 'SOIL_MOISTURE', value: 32, unit: '%', status: 'ONLINE', batteryLevel: 94, signalStrength: -64, lastReported: timeStr(2), normalRange: [20, 65], alertThreshold: 75 },
      { id: 'sn-cc-03', name: 'Retaining Wall Inclinometer C3', type: 'GROUND_MOVEMENT', value: 0.8, unit: 'mm', status: 'ONLINE', batteryLevel: 97, signalStrength: -58, lastReported: timeStr(2), normalRange: [0, 5], alertThreshold: 12 },
      { id: 'sn-cc-04', name: 'Piezometer C4', type: 'SOIL_PRESSURE', value: 10.1, unit: 'kPa', status: 'ONLINE', batteryLevel: 92, signalStrength: -68, lastReported: timeStr(3), normalRange: [5, 30], alertThreshold: 50 },
      { id: 'sn-cc-05', name: 'Vibration Sensor C5', type: 'VIBRATION', value: 0.3, unit: 'mm/s', status: 'ONLINE', batteryLevel: 98, signalStrength: -57, lastReported: timeStr(2), normalRange: [0, 2], alertThreshold: 4.0 }
    ],
    incidents: [],
    historicalTrend: generateHistoricalTrend(16, 4.5, 32, 0.8)
  }
];

export const INITIAL_ALERTS: LandslideAlert[] = [
  {
    id: 'alt-001',
    locationId: 'loc-hill-zone-a',
    locationName: 'Hill Zone A - Pine Ridge Crest',
    region: 'Highland Sector Alpha',
    timestamp: timeStr(8),
    riskScore: 88,
    riskLevel: 'CRITICAL',
    cause: 'Heavy torrential rainfall (52.4 mm/h) + saturated soil (88%) + rapid 18.6 mm ground displacement',
    recommendedAction: 'EVACUATION ORDER: Sound emergency sirens, halt downslope traffic, and evacuate 1,420 citizens to designated shelter zones.',
    status: 'CRITICAL_ACTIVE',
    broadcastSent: true,
    evacuationTriggered: true
  },
  {
    id: 'alt-002',
    locationId: 'loc-north-ridge-12',
    locationName: 'Northern Ridge Highway 12 Cut',
    region: 'North Corridor',
    timestamp: timeStr(24),
    riskScore: 76,
    riskLevel: 'HIGH',
    cause: 'Persistent downpour + pore pressure spike (48 kPa) + 11.2 mm roadcut displacement',
    recommendedAction: 'PRE-EVACUATION ALERT: Restrict Highway 12 to single-lane emergency convoys only. Alert rockfall dispatch unit.',
    status: 'HIGH_ACTIVE',
    broadcastSent: true,
    evacuationTriggered: false
  },
  {
    id: 'alt-003',
    locationId: 'loc-valley-pass-4',
    locationName: 'Valley Pass Sector 4 - River Basin',
    region: 'Eastern Valley',
    timestamp: timeStr(140),
    riskScore: 54,
    riskLevel: 'MODERATE',
    cause: 'Elevated riverbed saturation and 22.0 mm/h shower runoff',
    recommendedAction: 'ADVISORY: Inspect drainage culverts and broadcast local caution advisory.',
    status: 'ACKNOWLEDGED',
    broadcastSent: false,
    evacuationTriggered: false
  },
  {
    id: 'alt-004',
    locationId: 'loc-emerald-valley',
    locationName: 'Emerald Valley Settlement Slopes',
    region: 'Western Ghats Ridge',
    timestamp: timeStr(360),
    riskScore: 42,
    riskLevel: 'MODERATE',
    cause: 'Early morning cloudburst caused temporary surface runoff surge',
    recommendedAction: 'Cleared drainage grates; sensor levels stabilized.',
    status: 'RESOLVED',
    broadcastSent: false,
    evacuationTriggered: false
  }
];
