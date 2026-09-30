import { supabase, isSupabaseConfigured } from '../supabaseClient';

export interface ReeferTelemetryPoint {
  id: string;
  orderId: string;
  vanNumber: string;
  temperatureCelsius: number;
  humidityPercent: number;
  ambientTempCelsius: number;
  latitude: number;
  longitude: number;
  speedKmh: number;
  tamperSealIntact: boolean;
  batteryPercent: number;
  stageName: string;
  timestamp: string;
}

export const telemetryService = {
  getSimulatedTelemetry(orderId: string, progressFraction: number): ReeferTelemetryPoint {
    // Route from Nashik Farm Cluster (20.0° N, 73.78° E) to Mumbai Doorstep (19.05° N, 72.83° E)
    const startLat = 19.9975;
    const startLng = 73.7898;
    const endLat = 19.0596;
    const endLng = 72.8295;

    const clampedProg = Math.max(0, Math.min(1, progressFraction));
    const currentLat = startLat + (endLat - startLat) * clampedProg;
    const currentLng = startLng + (endLng - startLng) * clampedProg;

    // Simulate reefer temperature holding around 3.2°C - 3.6°C
    const tempFluctuation = Math.sin(Date.now() / 8000) * 0.4;
    const currentTemp = +(3.3 + tempFluctuation).toFixed(1);

    let stage = 'Farm Pre-Cooling & Loading';
    if (clampedProg > 0.15 && clampedProg < 0.5) stage = 'Expressway Cold Corridor Transit';
    else if (clampedProg >= 0.5 && clampedProg < 0.85) stage = 'Regional Cold Cross-Dock';
    else if (clampedProg >= 0.85 && clampedProg < 1.0) stage = 'Last-Mile Micro-Courier Dispatch';
    else if (clampedProg >= 1.0) stage = 'Doorstep Handover & Customer Escrow Inspection';

    return {
      id: `tel-${orderId}-${Date.now()}`,
      orderId,
      vanNumber: 'MH-15-EG-4402',
      temperatureCelsius: currentTemp,
      humidityPercent: Math.round(87 + Math.cos(Date.now() / 10000) * 3),
      ambientTempCelsius: 32.5,
      latitude: +currentLat.toFixed(5),
      longitude: +currentLng.toFixed(5),
      speedKmh: clampedProg >= 1.0 ? 0 : Math.round(48 + Math.sin(Date.now() / 4000) * 12),
      tamperSealIntact: true,
      batteryPercent: 96,
      stageName: stage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
  },

  async logTelemetry(point: ReeferTelemetryPoint) {
    if (!isSupabaseConfigured) return;
    try {
      await (supabase.from('reefer_telemetry') as any).insert({
        van_number: point.vanNumber,
        order_id: point.orderId,
        temperature_celsius: point.temperatureCelsius,
        humidity_percent: point.humidityPercent,
        ambient_temp_celsius: point.ambientTempCelsius,
        latitude: point.latitude,
        longitude: point.longitude,
        speed_kmh: point.speedKmh,
        tamper_seal_intact: point.tamperSealIntact,
        battery_percent: point.batteryPercent,
      });
    } catch (e) {
      console.warn('Telemetry log to Supabase skipped:', e);
    }
  },
};
