import React, { useState } from 'react';
import { farmerService, FarmerDispatchLot } from '../../supabase';

export const FarmerPanel: React.FC = () => {
  const [lots, setLots] = useState<FarmerDispatchLot[]>(farmerService.getDispatches());
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [crop, setCrop] = useState('San Marzano Vine Tomatoes');
  const [crates, setCrates] = useState(25);
  const [weightKg, setWeightKg] = useState(500);
  const [coldClass, setColdClass] = useState<'Leafy (2-4°C)' | 'Fruits (8-10°C)' | 'Dairy (1-3°C)'>('Leafy (2-4°C)');
  const [dispatchSuccess, setDispatchSuccess] = useState<string | null>(null);

  const handleBookPickup = (e: React.FormEvent) => {
    e.preventDefault();
    const newLot = farmerService.schedulePickup({
      farmerId: 'ramesh',
      farmerName: 'Ramesh Patel',
      cluster: 'Nashik Organic Syndicate',
      crop,
      crates,
      weightKg,
      harvestTime: 'Today Just Now',
      coldClass,
      vanAssigned: 'MH-15-EG-4402',
      escrowExpected: crates * 900,
    });
    setLots([newLot, ...lots]);
    setShowDispatchModal(false);
    setDispatchSuccess(`Pickup scheduled! Solar Reefer Van MH-15-EG-4402 assigned to farm gate.`);
    setTimeout(() => setDispatchSuccess(null), 5000);
  };

  const totalCleared = lots
    .filter((l) => l.escrowSettled)
    .reduce((sum, l) => sum + l.escrowExpected, 0);
  const totalInTransit = lots
    .filter((l) => !l.escrowSettled)
    .reduce((sum, l) => sum + l.escrowExpected, 0);

  return (
    <div className="space-y-6">
      {/* Top Welcome Strip */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold mb-2">
            <span className="material-symbols-outlined text-[16px]">agriculture</span>
            <span>Grower Partner Portal • Ramesh Patel</span>
          </div>
          <h2 className="text-2xl font-bold">Sahyadri Organic Cooperative #4</h2>
          <p className="text-emerald-100 text-xs mt-1 max-w-xl">
            142 Acres Organic Certified • 0.00 ppm chemical residue • Direct farmer payout rate: 94.1% of consumer spend.
          </p>
        </div>

        <button
          onClick={() => setShowDispatchModal(true)}
          className="px-4 py-2.5 bg-white text-emerald-900 font-bold rounded-xl text-xs hover:bg-emerald-50 transition-colors flex items-center gap-2 cursor-pointer shadow-md shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">rv_hookup</span>
          <span>Request Reefer Van Pickup</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">Cleared Escrow Settlements</span>
          <span className="text-2xl font-bold text-emerald-700">₹{totalCleared.toLocaleString()}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Disbursed directly to bank</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">In-Transit Escrow Pending</span>
          <span className="text-2xl font-bold text-amber-600">₹{totalInTransit.toLocaleString()}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Released on customer crispness check</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">Farm Gate Soil Humus</span>
          <span className="text-2xl font-bold text-slate-900">4.8%</span>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">Optimal organic carbon</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">Pre-Cooling Dock Temp</span>
          <span className="text-2xl font-bold text-cyan-600">3.1°C</span>
          <span className="text-[11px] text-slate-500 block mt-1">Zero-thermal-shock lock</span>
        </div>
      </div>

      {dispatchSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-emerald-700">check_circle</span>
            <span>{dispatchSuccess}</span>
          </div>
          <button onClick={() => setDispatchSuccess(null)}>✕</button>
        </div>
      )}

      {/* Harvest Batches & Reefer Dispatches Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Harvest Batches &amp; Reefer Pickup Ledger</h3>
            <p className="text-xs text-slate-500">Track consignment status and direct escrow settlement</p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {lots.length} Consignments Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-[10px]">
              <tr>
                <th className="p-3">Lot ID</th>
                <th className="p-3">Crop Variety</th>
                <th className="p-3">Volume</th>
                <th className="p-3">Cold Class</th>
                <th className="p-3">Reefer Van</th>
                <th className="p-3">Escrow Value</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lots.map((lot) => (
                <tr key={lot.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-mono font-bold text-emerald-800">{lot.id}</td>
                  <td className="p-3 font-semibold text-slate-900">{lot.crop}</td>
                  <td className="p-3 text-slate-600">
                    {lot.crates} crates ({lot.weightKg} kg)
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200">
                      {lot.coldClass}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-700">{lot.vanAssigned || 'Assigning...'}</td>
                  <td className="p-3 font-bold text-slate-900">₹{lot.escrowExpected.toLocaleString()}</td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        lot.status === 'Delivered & Settled'
                          ? 'bg-emerald-100 text-emerald-800'
                          : lot.status === 'Reefer Dispatched'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[12px]">
                        {lot.status === 'Delivered & Settled' ? 'check' : 'local_shipping'}
                      </span>
                      <span>{lot.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispatch Modal */}
      {showDispatchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Book Solar Reefer Van</h3>
              <button onClick={() => setShowDispatchModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleBookPickup} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Harvested Crop</label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none"
                >
                  <option>San Marzano Vine Tomatoes</option>
                  <option>Crisp Hydroponic Butterhead</option>
                  <option>Alphonso Mango Pre-Season Crates</option>
                  <option>Pure Raw A2 Gir Cow Milk (Chilled Cans)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Aerated Crates</label>
                  <input
                    type="number"
                    min="1"
                    value={crates}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setCrates(v);
                      setWeightKg(v * 20);
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Estimated Net Weight</label>
                  <input
                    type="text"
                    disabled
                    value={`${weightKg} kg`}
                    className="w-full p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Cold-Chain Temperature Class</label>
                <select
                  value={coldClass}
                  onChange={(e) => setColdClass(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none"
                >
                  <option value="Leafy (2-4°C)">Leafy &amp; Vine (2.0°C – 4.0°C)</option>
                  <option value="Fruits (8-10°C)">Heirloom Fruits (8.0°C – 10.0°C)</option>
                  <option value="Dairy (1-3°C)">A2 Fresh Milk (1.0°C – 3.0°C)</option>
                </select>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-[11px]">
                ⚡ Solar Reefer van will arrive at your pre-cooling shed within 45 minutes with digital BLE tamper tags.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDispatchModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs"
                >
                  Confirm Pickup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
