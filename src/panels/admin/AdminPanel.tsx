import React, { useState } from 'react';
import { FLEET_DATABASE, ReeferFleetUnit } from '../../backend/services/coldChainService';

export const AdminPanel: React.FC = () => {
  const [fleet, setFleet] = useState<ReeferFleetUnit[]>(FLEET_DATABASE);
  const [selectedVan, setSelectedVan] = useState<ReeferFleetUnit>(FLEET_DATABASE[0]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
            <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
            <span>Platform Admin &amp; Cold-Chain Command Center</span>
          </div>
          <h2 className="text-2xl font-bold">Western Ghats Logistics &amp; Escrow Vault</h2>
          <p className="text-slate-400 text-xs mt-1 max-w-xl">
            Real-time IoT telemetry, reefer fleet temperature compliance, 0.00 ppm pesticide certification audits, and escrow custody.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-semibold text-emerald-300">All 4 Fleet Units Active</span>
        </div>
      </div>

      {/* High-Level Financial & Quality Vault Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">Total Escrow Vault Balance</span>
          <span className="text-2xl font-bold text-slate-900">₹2,132,400</span>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">₹148k locked in live transit</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">Producer Share Payout Ratio</span>
          <span className="text-2xl font-bold text-emerald-700">94.1%</span>
          <span className="text-[11px] text-slate-500 block mt-1">Direct to grower bank accounts</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">Mean Chemical Residue</span>
          <span className="text-2xl font-bold text-slate-900">0.00 ppm</span>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">100% verified organic lots</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">Cold-Chain Breach Rate</span>
          <span className="text-2xl font-bold text-emerald-600">0.0%</span>
          <span className="text-[11px] text-slate-500 block mt-1">Zero thermal anomalies recorded</span>
        </div>
      </div>

      {/* Cold-Chain Fleet Radar Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-cyan-600 text-[18px]">radar</span>
              Refrigerated Reefer Fleet Live Radar
            </h3>
            <p className="text-xs text-slate-500">Live solar chiller battery, cargo temperature, and GPS positions</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
            4 Units Monitored
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {fleet.map((unit) => (
            <div
              key={unit.vanNumber}
              onClick={() => setSelectedVan(unit)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedVan.vanNumber === unit.vanNumber
                  ? 'border-emerald-600 bg-emerald-50/40 shadow-xs ring-1 ring-emerald-500'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100/60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-xs text-slate-900">{unit.vanNumber}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    unit.status === 'optimal'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {unit.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Driver:</span>
                  <span className="font-semibold text-slate-800">{unit.driverName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Cargo Temp:</span>
                  <span
                    className={`font-black text-sm ${
                      unit.currentTempCelsius > 4.5 ? 'text-amber-600' : 'text-emerald-700'
                    }`}
                  >
                    {unit.currentTempCelsius.toFixed(1)}°C
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Solar Battery:</span>
                  <span className="font-semibold text-slate-800">{unit.batteryReservePercent}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Active Orders:</span>
                  <span className="font-bold text-slate-800">{unit.activeOrdersCount} lots</span>
                </div>
              </div>

              <p className="mt-2 pt-2 border-t border-slate-200/80 text-[10px] text-slate-500 truncate">
                📍 {unit.currentLocation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Reefer Deep Inspection */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
              Telematics Deep-Dive
            </span>
            <h4 className="text-lg font-bold text-slate-100">
              {selectedVan.vanNumber} • {selectedVan.driverName}
            </h4>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400">Driver Hotline: {selectedVan.driverPhone}</span>
            <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
              Tamper Seal Verified
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block mb-1">Location Coordinates</span>
            <span className="font-bold text-slate-200">{selectedVan.currentLocation}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block mb-1">Target Setting</span>
            <span className="font-bold text-slate-200">{selectedVan.targetTempCelsius}°C</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block mb-1">Relative Humidity</span>
            <span className="font-bold text-blue-400">{selectedVan.humidityPercent}% RH</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block mb-1">Solar Photovoltaic In</span>
            <span className="font-bold text-amber-300">{selectedVan.solarInputWatts} Watts</span>
          </div>
        </div>
      </div>
    </div>
  );
};
