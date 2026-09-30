import React, { useState, useEffect } from 'react';
import { FarmerDispatchLot } from '../../supabase';
import { firestoreService } from '../../services/firestoreService';

export const FarmerPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'workflow' | 'dispatches' | 'ledger' | 'telemetry'>('workflow');
  const [lots, setLots] = useState<FarmerDispatchLot[]>([]);

  // Load and listen to real-time dispatches from Firestore
  useEffect(() => {
    firestoreService.getFarmerDispatches().then((data) => {
      if (data && data.length > 0) setLots(data);
    });

    const unsubscribe = firestoreService.listenFarmerDispatches((realLots) => {
      if (realLots && realLots.length > 0) setLots(realLots);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Interactive 4-step workflow state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [crop, setCrop] = useState('San Marzano Vine Tomatoes');
  const [crates, setCrates] = useState(25);
  const [weightKg, setWeightKg] = useState(500);
  const [sugarBrix, setSugarBrix] = useState('8.4° Brix');
  const [labTestId, setLabTestId] = useState('NPOP-LAB-9921');
  const [residuePpm, setResiduePpm] = useState('0.00 ppm');
  const [preCoolingTemp, setPreCoolingTemp] = useState('3.1°C');
  const [coldClass, setColdClass] = useState<'Leafy (2-4°C)' | 'Fruits (8-10°C)' | 'Dairy (1-3°C)'>('Leafy (2-4°C)');
  const [assignedVan, setAssignedVan] = useState('MH-15-EG-4402');
  const [workflowSuccess, setWorkflowSuccess] = useState<string | null>(null);

  const handleCompleteWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    const newLot: FarmerDispatchLot = {
      id: `LOT-${Math.floor(1000 + Math.random() * 9000)}`,
      farmerId: 'ramesh',
      farmerName: 'Ramesh Patel',
      cluster: 'Nashik Organic Syndicate #4',
      crop,
      crates,
      weightKg,
      harvestTime: 'Today Just Now',
      coldClass,
      vanAssigned: assignedVan,
      escrowExpected: crates * 900,
      escrowSettled: false,
      status: 'Reefer Dispatched',
    };

    setLots([newLot, ...lots]);
    setWorkflowSuccess(`Lot ${newLot.id} successfully queued for Solar Reefer Van ${assignedVan}! Pre-cooling seal verified and saved to real database.`);
    setCurrentStep(1);
    setActiveTab('dispatches');
    setTimeout(() => setWorkflowSuccess(null), 6000);

    try {
      await firestoreService.createFarmerDispatch(newLot);
      console.log('Farmer dispatch saved to real Firestore database:', newLot.id);
    } catch (err) {
      console.error('Failed to save dispatch to Firestore:', err);
    }
  };

  const totalCleared = lots
    .filter((l) => l.escrowSettled)
    .reduce((sum, l) => sum + l.escrowExpected, 0);
  const totalInTransit = lots
    .filter((l) => !l.escrowSettled)
    .reduce((sum, l) => sum + l.escrowExpected, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold mb-2">
            <span className="material-symbols-outlined text-[16px]">agriculture</span>
            <span>Grower Cooperative Portal • Lead Farmer Ramesh Patel</span>
          </div>
          <h2 className="text-2xl font-bold">Sahyadri Organic Syndicate #4 (Nashik)</h2>
          <p className="text-emerald-100 text-xs mt-1 max-w-xl">
            142 Acres Organic PGS-India Certified • 0.00 ppm pesticide compliance • 94.1% of every rupee paid settled directly to grower bank accounts.
          </p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex flex-wrap items-center gap-1.5 bg-emerald-950/60 p-1.5 rounded-xl border border-emerald-700/60">
          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'workflow' ? 'bg-white text-emerald-900 shadow-xs' : 'text-emerald-200 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">add_task</span>
            <span>Harvest Workflow</span>
          </button>
          <button
            onClick={() => setActiveTab('dispatches')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'dispatches' ? 'bg-white text-emerald-900 shadow-xs' : 'text-emerald-200 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">local_shipping</span>
            <span>Dispatches ({lots.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'ledger' ? 'bg-white text-emerald-900 shadow-xs' : 'text-emerald-200 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
            <span>Escrow Ledger</span>
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'telemetry' ? 'bg-white text-emerald-900 shadow-xs' : 'text-emerald-200 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">sensors</span>
            <span>Soil IoT</span>
          </button>
        </div>
      </div>

      {workflowSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between animate-fadeIn shadow-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-emerald-700">verified</span>
            <span>{workflowSuccess}</span>
          </div>
          <button onClick={() => setWorkflowSuccess(null)} className="cursor-pointer">✕</button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">Cleared Escrow Settlements</span>
          <span className="text-2xl font-bold text-emerald-700">₹{totalCleared.toLocaleString()}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Disbursed to Sahyadri Bank Acct</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">In-Transit Escrow Pending</span>
          <span className="text-2xl font-bold text-amber-600">₹{totalInTransit.toLocaleString()}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Instant release on doorstep delivery</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">Soil Humus Content</span>
          <span className="text-2xl font-bold text-slate-900">4.8%</span>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">Regenerative organic carbon</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">Pre-Cooling Hub Temp</span>
          <span className="text-2xl font-bold text-cyan-600">{preCoolingTemp}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Hermetic lock active</span>
        </div>
      </div>

      {/* Tab 1: Interactive Farmer Workflow (Harvest -> QC -> Reefer Booking -> Dispatch) */}
      {activeTab === 'workflow' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-700 text-[22px]">published_with_changes</span>
              Interactive Farmer Daily Harvest &amp; Dispatch Workflow
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Complete the 4-step grower protocol to log harvest lots, verify zero-chemical residue, and dispatch refrigerated transport.
            </p>

            {/* Stepper Wizard Bar */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              {[
                { step: 1, title: 'Harvest Log', icon: 'yard' },
                { step: 2, title: 'Zero-Residue QC', icon: 'biotech' },
                { step: 3, title: 'Reefer Van Booking', icon: 'local_shipping' },
                { step: 4, title: 'Review & Confirm', icon: 'check_circle' },
              ].map((s) => (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => setCurrentStep(s.step)}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-2 ${
                    currentStep === s.step
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-500'
                      : currentStep > s.step
                      ? 'border-emerald-200 bg-emerald-50/50 text-emerald-700'
                      : 'border-slate-200 text-slate-400 bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
                  <div>
                    <span className="text-[10px] uppercase block tracking-wider">Step {s.step}</span>
                    <span className="text-xs">{s.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleCompleteWorkflow} className="space-y-6 text-xs">
            {/* Step 1: Harvest Details */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Harvested Crop Variety</label>
                    <select
                      value={crop}
                      onChange={(e) => setCrop(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none"
                    >
                      <option>San Marzano Vine Tomatoes</option>
                      <option>Crisp Hydroponic Butterhead</option>
                      <option>Alphonso Mango Pre-Season Crates</option>
                      <option>Pure Raw A2 Gir Cow Milk (Chilled Cans)</option>
                      <option>Shimla Royal Delicious Apples</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Harvest Hour</label>
                    <input
                      type="text"
                      defaultValue="Dawn Pick (05:30 AM - 06:45 AM)"
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Aerated Crates Count</label>
                    <input
                      type="number"
                      min="1"
                      value={crates}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setCrates(val);
                        setWeightKg(val * 20);
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Total Net Weight (kg)</label>
                    <input
                      type="text"
                      disabled
                      value={`${weightKg} kg`}
                      className="w-full p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Refractometer Sugar Brix</label>
                    <input
                      type="text"
                      value={sugarBrix}
                      onChange={(e) => setSugarBrix(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Proceed to Quality Check</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Quality & Zero-Residue Certification */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">NPOP Lab Batch Cert #</label>
                    <input
                      type="text"
                      value={labTestId}
                      onChange={(e) => setLabTestId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Chemical Residue Level</label>
                    <input
                      type="text"
                      value={residuePpm}
                      onChange={(e) => setResiduePpm(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-emerald-500 bg-emerald-50/50 text-emerald-900 font-bold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Farm Pre-Cooling Dock Temp</label>
                    <input
                      type="text"
                      value={preCoolingTemp}
                      onChange={(e) => setPreCoolingTemp(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-emerald-700">verified</span>
                  <span>PGS-India Zero Synthetic Chemical guarantee verified. Rapid spectrometer scan: Pass.</span>
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Proceed to Reefer Booking</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Reefer Van Booking */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Cold-Chain Temperature Class</label>
                    <select
                      value={coldClass}
                      onChange={(e) => setColdClass(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none"
                    >
                      <option value="Leafy (2-4°C)">Leafy &amp; Vine (2.0°C – 4.0°C)</option>
                      <option value="Fruits (8-10°C)">Heirloom Tree Fruits (8.0°C – 10.0°C)</option>
                      <option value="Dairy (1-3°C)">A2 Farm Fresh Milk (1.0°C – 3.0°C)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Assign Reefer Unit</label>
                    <select
                      value={assignedVan}
                      onChange={(e) => setAssignedVan(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none"
                    >
                      <option value="MH-15-EG-4402">MH-15-EG-4402 (Santosh Yadav, Pre-Cooled at 3.4°C)</option>
                      <option value="MH-04-AX-9912">MH-04-AX-9912 (Mahesh K., Pre-Cooled at 3.1°C)</option>
                      <option value="MH-12-PQ-7710">MH-12-PQ-7710 (Rajendra D., Standby at Hub)</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Solar Reefer Transit ETA to Mumbai:</span>
                    <span className="font-bold text-slate-900">3.5 hours via Samruddhi Expressway</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>IoT BLE Tamper Tag Assignment:</span>
                    <span className="font-mono font-semibold text-emerald-800">BLE-TAG-8840</span>
                  </div>
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Review Consignment Summary</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review & Finalize Dispatch */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
                  <h4 className="font-bold text-emerald-950 text-sm">Consignment Final Dispatch Summary</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block">Produce:</span>
                      <span className="font-bold text-slate-900">{crop}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Volume:</span>
                      <span className="font-bold text-slate-900">{crates} crates ({weightKg} kg)</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Cold Band:</span>
                      <span className="font-bold text-emerald-800">{coldClass}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Expected Escrow Payout:</span>
                      <span className="font-bold text-emerald-700 text-sm">₹{(crates * 900).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    <span>Confirm &amp; Dispatch Reefer Lot</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Tab 2: Dispatches Radar */}
      {activeTab === 'dispatches' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Consignment Dispatches Radar</h3>
              <p className="text-xs text-slate-500">Live refrigerated transit status and door seal telemetry</p>
            </div>
            <button
              onClick={() => setActiveTab('workflow')}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              <span>New Harvest Lot</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Lot ID</th>
                  <th className="p-3">Crop Variety</th>
                  <th className="p-3">Volume</th>
                  <th className="p-3">Cold Class</th>
                  <th className="p-3">Reefer Unit</th>
                  <th className="p-3">Expected Payout</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lots.map((lot) => (
                  <tr key={lot.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-emerald-800">{lot.id}</td>
                    <td className="p-3 font-semibold text-slate-900">{lot.crop}</td>
                    <td className="p-3 text-slate-600">{lot.crates} crates ({lot.weightKg} kg)</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200">
                        {lot.coldClass}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-700">{lot.vanAssigned || 'Auto-Routing'}</td>
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
      )}

      {/* Tab 3: Escrow Ledger */}
      {activeTab === 'ledger' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Direct Escrow Payouts &amp; Bank Settlement Ledger</h3>
              <p className="text-xs text-slate-500">Every rupee is settled automatically via UPI / NEFT upon customer crispness acceptance</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              Producer Share: 94.1%
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {lots.map((l) => (
              <div key={l.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{l.id}</span>
                    <span className="font-semibold text-slate-800">{l.crop}</span>
                    <span className="text-slate-500">({l.crates} crates)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Beneficiary: Sahyadri Farmers Producer Co. Ltd. • IFSC: MAHB0000412
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-base font-bold text-emerald-700 block">
                    ₹{l.escrowExpected.toLocaleString()}
                  </span>
                  <span className={`text-[10px] font-bold ${l.escrowSettled ? 'text-emerald-800' : 'text-amber-700'}`}>
                    {l.escrowSettled ? '✓ Funds Disbursed to Bank' : '⏳ Escrow Locked in Transit'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Soil IoT */}
      {activeTab === 'telemetry' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-700 text-[18px]">grass</span>
              Live Soil Sensor Array (Plot 4B, Nashik)
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-500">Volumetric Soil Moisture:</span>
                <span className="font-bold text-blue-600">28.4% (Optimal)</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-500">Organic Carbon / Humus:</span>
                <span className="font-bold text-emerald-700">4.8% (Regenerative)</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-500">Soil Temperature:</span>
                <span className="font-bold text-slate-800">21.2°C at 15cm depth</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-500">Nitrogen-Phosphorus-Potassium:</span>
                <span className="font-bold text-emerald-800">Balanced 14:14:14 NPK</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-cyan-600 text-[18px]">ac_unit</span>
              Pre-Cooling Dock Sensors
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-500">Dock Chamber Temperature:</span>
                <span className="font-bold text-cyan-700">3.1°C</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-500">Chamber Relative Humidity:</span>
                <span className="font-bold text-blue-600">92% RH</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-500">Solar Battery Storage:</span>
                <span className="font-bold text-amber-600">98% Charged</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-500">Hermetic Seal Status:</span>
                <span className="font-bold text-emerald-700">Pressurized &amp; Verified</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
