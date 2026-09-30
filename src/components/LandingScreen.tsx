import React from 'react';
import { ActiveScreen, ProduceItem } from '../types';
import { INITIAL_PRODUCE, REGIONAL_CLUSTERS } from '../data/mockData';

interface LandingScreenProps {
  setActiveScreen: (screen: ActiveScreen) => void;
  onAddToCart: (item: ProduceItem, quantity: number) => void;
  onOpenTrace: (batchId: string) => void;
  openAddressModal: () => void;
  currentAddress: string;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  setActiveScreen,
  onAddToCart,
  onOpenTrace,
  openAddressModal,
  currentAddress,
}) => {
  const featuredProduce = INITIAL_PRODUCE.slice(0, 4);

  return (
    <div className="w-full flex flex-col bg-[#f8fafc] text-slate-900">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-6 pb-16 lg:py-20 border-b border-slate-200 bg-gradient-to-b from-emerald-50/40 via-white to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Unboxed Metadata Kicker */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-800">
                <span>Sahyadri &amp; Western Ghats Collectives</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>Sub-4°C Solar Reefer Transit</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>Zero Intermediaries</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1] text-balance">
                Pure farm harvest at your doorstep. Verified 0.00 ppm residue.
              </h1>

              {/* Value Proposition Subhead */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl text-pretty">
                Direct farm-to-table organic produce harvested within 14 hours of delivery. 
                Protected by refrigerated cold-chain transit and doorstep escrow inspection—where 
                94.1% of every rupee goes straight to smallholder farmer accounts.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setActiveScreen('marketplace')}
                  className="px-6 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl text-sm transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Today's Harvest Lots</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>

                <button
                  onClick={() => setActiveScreen('traceability')}
                  className="px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-xl text-sm border border-slate-300 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-emerald-700 text-[18px]">biotech</span>
                  <span>Verify Soil Lab Data</span>
                </button>
              </div>

              {/* Location delivery assurance bar */}
              <div className="pt-4 flex items-center gap-3 text-xs text-slate-500 border-t border-slate-100">
                <span className="material-symbols-outlined text-emerald-700 text-[18px]">local_shipping</span>
                <span>Delivering next-day sunrise harvests to:</span>
                <button
                  onClick={openAddressModal}
                  className="font-bold text-slate-800 underline decoration-slate-300 hover:decoration-emerald-700 cursor-pointer"
                >
                  {currentAddress}
                </button>
              </div>
            </div>

            {/* Right Visual Focal Anchor */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 bg-white">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCK_rZ1oQp2b8h_Ym70q_U4Vf4y23t0pB4KjY9b_x9kX-7gV5b_Q3a1z8k_0mP9qT5v_7y2_X1b9_4M2q_8a1_K4q_0p_7y2b_8a1_K4q_0p_7y2"
                  alt="Organic produce freshly harvested at dawn"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 object-cover"
                />

                {/* Live Harvest Inspection Badge Overlay */}
                <div className="p-5 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                        Live Consignment in Transit
                      </span>
                      <h3 className="font-bold text-slate-900 text-base">
                        Batch #NSK-8821 • Heirloom Roma Tomatoes
                      </h3>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                      3.8°C Locked
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs py-2 border-y border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Harvest Time</span>
                      <span className="font-semibold text-slate-800">Today, 05:30 AM</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Grower Share</span>
                      <span className="font-semibold text-emerald-700">94.1% Direct</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Residue Test</span>
                      <span className="font-semibold text-slate-800">0.00 ppm SGS</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-500">Origin: Sahyadri Syndicate, Nashik</span>
                    <button
                      onClick={() => onOpenTrace('#NSK-8821')}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Lab Certificate</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Quantitative Rigor Bar */}
      <section className="py-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <span className="text-2xl lg:text-3xl font-bold text-slate-900 tabular-nums">14 Hours</span>
              <p className="text-xs text-slate-600 leading-snug">
                Average time from field cutting to your kitchen table
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-2xl lg:text-3xl font-bold text-emerald-700 tabular-nums">0.00 ppm</span>
              <p className="text-xs text-slate-600 leading-snug">
                Pesticide &amp; synthetic chemical residue on every lot
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-2xl lg:text-3xl font-bold text-slate-900 tabular-nums">94.1%</span>
              <p className="text-xs text-slate-600 leading-snug">
                Farm gate payout directly credited to grower accounts
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-2xl lg:text-3xl font-bold text-slate-900 tabular-nums">1,280+</span>
              <p className="text-xs text-slate-600 leading-snug">
                Certified smallholders across 4 regional clusters
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 3-Step Mechanism: How FarmDirect Works */}
      <section className="py-16 lg:py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Transparent Supply Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight text-balance">
              The anti-intermediary farm standard.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Traditional supply chains route produce through APMC mandis, wholesale brokers, 
              and commercial cold rooms for 6 to 9 days. Here is how FarmDirect eliminates the waste.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold text-emerald-800">
                  01. HARVEST-ON-DEMAND
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Picked at Sunrise for Your Order
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Orders cut off at 9:00 PM nightly. Collectives receive the exact dispatch manifest 
                  and pick crops between 5:00 AM and 7:00 AM, preventing warehouse rotting and food waste.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Field Block Verification</span>
                <span className="font-semibold text-slate-800">PGS-India Certified</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold text-emerald-800">
                  02. REFRIGERATED TRANSIT
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Sub-4°C Continuous Cold-Chain
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Produce travels in solar-assisted refrigerated vans monitored by real-time IoT 
                  temperature probes. Enzymes and antioxidants remain intact until delivery.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>IoT Sensor Telemetry</span>
                <span className="font-semibold text-emerald-700">Live Temperature Tracking</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold text-emerald-800">
                  03. DOORSTEP ESCROW
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Inspect Quality Before Funds Release
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Your payment is held in smart custody. You inspect your crates upon delivery; once you 
                  approve, funds settle directly to the farmer collective. If crispness fails, 100% refund is instant.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Escrow Guarantee</span>
                <span className="font-semibold text-slate-800">Zero Consumer Risk</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Today's Fresh Lots */}
      <section className="py-16 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Harvest Lots Available Today
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Dispatched from morning field blocks.
              </h2>
            </div>

            <button
              onClick={() => setActiveScreen('marketplace')}
              className="text-sm font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
            >
              <span>View All 8 Produce Categories</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProduce.map((prod) => (
              <div
                key={prod.id}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-sm text-[11px] font-bold text-slate-800 border border-slate-200">
                      {prod.harvestTime}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <span>{prod.farmer}</span>
                      <span aria-hidden="true">·</span>
                      <span>{prod.origin}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm leading-snug">
                      {prod.name}
                    </h3>

                    <div className="flex items-baseline justify-between pt-1">
                      <div>
                        <span className="text-base font-bold text-slate-900">₹{prod.price}</span>
                        <span className="text-xs text-slate-500"> / {prod.unit}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700">
                        {prod.growerSharePercent}% to grower
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onOpenTrace(prod.batchId)}
                    className="py-2 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer text-center"
                  >
                    Trace Lot
                  </button>
                  <button
                    onClick={() => onAddToCart(prod, 1)}
                    className="py-2 px-3 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-xs font-semibold text-white cursor-pointer text-center"
                  >
                    Add to Basket
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Direct Comparison: FarmDirect vs Commercial Organic Retail */}
      <section className="py-16 lg:py-24 border-b border-slate-200 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Transparency Audit
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              FarmDirect compared to supermarket "organic" shelves.
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-700">
                <tr>
                  <th className="p-4 sm:p-5 font-bold">Standard Metric</th>
                  <th className="p-4 sm:p-5 font-bold text-emerald-800 bg-emerald-50/50">
                    FarmDirect Collective Mesh
                  </th>
                  <th className="p-4 sm:p-5 font-bold text-slate-500">
                    Commercial Supermarket Shelf
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">Time From Harvest</td>
                  <td className="p-4 sm:p-5 font-bold text-emerald-800 bg-emerald-50/20">
                    12 – 18 Hours (Morning pick)
                  </td>
                  <td className="p-4 sm:p-5 text-slate-600">5 – 9 Days (Mandi warehousing)</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">Lab Residue Testing</td>
                  <td className="p-4 sm:p-5 font-bold text-emerald-800 bg-emerald-50/20">
                    0.00 ppm SGS Certificate per batch
                  </td>
                  <td className="p-4 sm:p-5 text-slate-600">Annual random audit only</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">Grower Payout Share</td>
                  <td className="p-4 sm:p-5 font-bold text-emerald-800 bg-emerald-50/20">
                    94.1% Direct Escrow
                  </td>
                  <td className="p-4 sm:p-5 text-slate-600">22% – 30% (70%+ to brokers)</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">Transit Temperature</td>
                  <td className="p-4 sm:p-5 font-bold text-emerald-800 bg-emerald-50/20">
                    Sub-4°C Solar Refrigerated fleet
                  </td>
                  <td className="p-4 sm:p-5 text-slate-600">Ambient trucks &amp; dry stores</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">Consumer Escrow Protection</td>
                  <td className="p-4 sm:p-5 font-bold text-emerald-800 bg-emerald-50/20">
                    Release funds after doorstep inspection
                  </td>
                  <td className="p-4 sm:p-5 text-slate-600">No recourse once billed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6. Farmer Collective Spotlight */}
      <section className="py-16 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Farmer Federation Voice
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                "We know every customer who eats from our soil."
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                "Before FarmDirect, we sold our heirloom tomatoes to mandi agents at ₹12/kg, 
                who sold them in Bandra for ₹70/kg while taking two weeks to settle payments. Today, 
                our 48 smallholders receive ₹42.50/kg directly into escrow within minutes of delivery."
              </p>
              <div className="pt-2">
                <span className="font-bold text-slate-900 block text-sm">Ramesh Patel</span>
                <span className="text-xs text-slate-500">
                  Lead Agronomist • Sahyadri Organic Growers Syndicate (48 Farmers)
                </span>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  onClick={() => setActiveScreen('community')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs cursor-pointer"
                >
                  Chat with Ramesh Patel
                </button>
                <button
                  onClick={() => setActiveScreen('traceability')}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs cursor-pointer"
                >
                  View Sahyadri Soil Map
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {REGIONAL_CLUSTERS.slice(0, 2).map((cluster) => (
                <div
                  key={cluster.id}
                  className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={cluster.leadFarmerAvatar}
                      alt={cluster.leadFarmer}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{cluster.name}</h4>
                      <span className="text-xs text-slate-500">{cluster.region}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {cluster.bio}
                  </p>

                  <div className="pt-3 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">Soil NPK</span>
                      <span className="font-bold text-slate-800">{cluster.soilNpk} Optimal</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Chemical Residue</span>
                      <span className="font-bold text-emerald-700">0.00 ppm</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Conversion Section */}
      <section className="py-16 lg:py-20 bg-emerald-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Tomorrow's Morning Cut Manifest Now Open</span>
          </span>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white text-balance">
            Taste produce harvested this morning.
          </h2>

          <p className="text-sm sm:text-base text-emerald-100 max-w-xl mx-auto leading-relaxed">
            Reserve your crates before tonight's 9:00 PM cutoff. Inspected at your door, 
            protected by smart escrow, delivered cold.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setActiveScreen('marketplace')}
              className="px-8 py-3.5 bg-white text-emerald-950 font-bold rounded-xl text-sm hover:bg-emerald-50 transition-all shadow-md cursor-pointer"
            >
              Enter Farm Marketplace
            </button>
            <button
              onClick={() => setActiveScreen('traceability')}
              className="px-6 py-3.5 bg-emerald-800/90 text-white font-semibold rounded-xl text-sm hover:bg-emerald-800 border border-emerald-700 transition-colors cursor-pointer"
            >
              Verify Active Batch Timeline
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
