import React, { useState } from 'react';
import { ActiveScreen, CartItem } from '../types';

interface CheckoutScreenProps {
  cart: CartItem[];
  currentAddress: string;
  openAddressModal: () => void;
  onPlaceOrder: (total: number) => void;
  setActiveScreen: (screen: ActiveScreen) => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  cart,
  currentAddress,
  openAddressModal,
  onPlaceOrder,
  setActiveScreen,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<'express' | 'evening'>('express');
  const [packagingChoice, setPackagingChoice] = useState<'bamboo' | 'glass'>('bamboo');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'wallet' | 'card' | 'netbanking'>('upi');

  const farmGateTotal = 845.0;
  const logisticsFee = 45.0;
  const platformFee = 8.45;
  const middlemanSaved = 185.0;
  const totalPayable = farmGateTotal + logisticsFee + platformFee; // ₹898.45

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 w-full pb-24">
      {/* 3 Steps Indicator */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-8 max-w-xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
            ✓
          </span>
          <span className="text-xs font-semibold text-slate-900">Cart Verified</span>
        </div>
        <div className="flex-1 h-0.5 bg-emerald-700 mx-4"></div>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
            2
          </span>
          <span className="text-xs font-semibold text-slate-900">Escrow Lock &amp; Delivery</span>
        </div>
        <div className="flex-1 h-0.5 bg-slate-200 mx-4"></div>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 text-xs font-bold flex items-center justify-center">
            3
          </span>
          <span className="text-xs font-medium text-slate-400">Inspection Payout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery & Items (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Delivery Address & Time Slot */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                  <span className="material-symbols-outlined text-[20px]">home_pin</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Priya Sharma</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Flat 402, Sea Green Apartments, Perry Cross Road, {currentAddress}
                  </p>
                  <span className="text-xs text-slate-400 mt-1 block">+91 98201 44892</span>
                </div>
              </div>

              <button
                type="button"
                onClick={openAddressModal}
                className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
              >
                Change Address
              </button>
            </div>

            {/* Slot Option */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-emerald-700 text-[20px]">electric_bolt</span>
                <div>
                  <span className="font-semibold text-slate-900 block">
                    {selectedSlot === 'express'
                      ? 'Today 11:30 AM – 1:00 PM (Express Harvest Slot)'
                      : 'Today 05:00 PM – 07:30 PM (Evening Sunset Slot)'}
                  </span>
                  <span className="text-slate-500">Nashik refrigerated van en route to Bandra hub</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSlot(selectedSlot === 'express' ? 'evening' : 'express')}
                className="text-emerald-700 font-semibold hover:underline cursor-pointer"
              >
                Change Slot
              </button>
            </div>
          </div>

          {/* Harvest Allocation by Farm Origin */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Harvest Allocation by Farm Origin</h3>
              <span className="text-xs text-slate-400">3 Smallholder Collectives</span>
            </div>

            {/* Farm 1: Ramesh Patel */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Ramesh Patel Farm (Nashik Valley)</span>
                <span className="text-emerald-700 font-semibold">Reefer Van #4 · 11:30 AM</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">3x Vine-Ripened Country Tomatoes (3 kg crate)</span>
                  <span className="font-bold text-slate-900">₹135.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">2x Hydroponic Baby Spinach (500g)</span>
                  <span className="font-bold text-slate-900">₹80.00</span>
                </div>
              </div>
            </div>

            {/* Farm 2: Green Valley Orchards */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Green Valley Orchards (Shimla, HP)</span>
                <span className="text-sky-700 font-semibold">Climate-Controlled Hub</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700">2x Organic Shimla Royal Delicious Apples (Grade A+)</span>
                <span className="font-bold text-slate-900">₹440.00</span>
              </div>
            </div>

            {/* Farm 3: Nandini Pastoral Dairy */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Nandini Organic Pastoral Dairy (Pune)</span>
                <span className="text-emerald-700 font-semibold">4.8% Fat A2 Certified</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700">2x Raw Pure A2 Gir Cow Milk (2 Liters glass bottles)</span>
                <span className="font-bold text-slate-900">₹190.00</span>
              </div>
            </div>
          </div>

          {/* Eco-Packaging Selector */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Packaging Preference</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                onClick={() => setPackagingChoice('bamboo')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  packagingChoice === 'bamboo'
                    ? 'border-emerald-700 bg-emerald-50/70'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <input
                    type="radio"
                    name="packaging"
                    checked={packagingChoice === 'bamboo'}
                    onChange={() => setPackagingChoice('bamboo')}
                    className="mt-0.5 accent-emerald-700"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 text-xs block">
                      Biodegradable Bamboo Fiber Crates
                    </span>
                    <span className="text-[11px] text-slate-500">100% home-compostable banana bark</span>
                    <span className="text-xs text-emerald-700 font-bold block mt-1">₹0.00 (Included)</span>
                  </div>
                </div>
              </label>

              <label
                onClick={() => setPackagingChoice('glass')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  packagingChoice === 'glass'
                    ? 'border-emerald-700 bg-emerald-50/70'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <input
                    type="radio"
                    name="packaging"
                    checked={packagingChoice === 'glass'}
                    onChange={() => setPackagingChoice('glass')}
                    className="mt-0.5 accent-emerald-700"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 text-xs block">
                      Sterilized Returnable Glass Bottles
                    </span>
                    <span className="text-[11px] text-slate-500">Hand back empty bottles for ₹30 credit</span>
                    <span className="text-xs text-sky-700 font-bold block mt-1">Exchange Active</span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Escrow Payment Gateway</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'upi', title: 'Instant UPI', desc: 'Google Pay, PhonePe, Paytm, BHIM', icon: 'qr_code_2' },
                { id: 'wallet', title: 'FarmDirect Wallet', desc: 'Available: ₹1,420.00', icon: 'account_balance_wallet' },
                { id: 'card', title: 'Credit / Debit Cards', desc: 'Visa, Mastercard, RuPay', icon: 'credit_card' },
                { id: 'netbanking', title: 'Direct NetBanking', desc: 'All major Indian banks', icon: 'account_balance' },
              ].map((p) => (
                <label
                  key={p.id}
                  onClick={() => setPaymentMethod(p.id as any)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === p.id
                      ? 'border-emerald-700 bg-emerald-50/70'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="payment_method"
                      value={p.id}
                      checked={paymentMethod === p.id}
                      onChange={() => setPaymentMethod(p.id as any)}
                      className="accent-emerald-700"
                    />
                    <div>
                      <span className="font-semibold text-slate-900 text-xs block">{p.title}</span>
                      <span className="text-[11px] text-slate-500">{p.desc}</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">{p.icon}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Rupee Transparency & Action Button (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 sticky top-28">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-base">Rupee Transparency</h3>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                94.1% Direct to Grower
              </span>
            </div>

            {/* Split Bar */}
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex mb-2">
              <div className="bg-emerald-600 h-full w-[94.1%]" title="Farmer 94%"></div>
              <div className="bg-sky-500 h-full w-[5%]" title="Cold Chain 5%"></div>
              <div className="bg-amber-500 h-full w-[0.9%]" title="Tech 1%"></div>
            </div>

            <div className="flex justify-between text-[11px] text-slate-500">
              <span className="text-emerald-700 font-semibold">Farmer: 94%</span>
              <span className="text-sky-600 font-semibold">Cold-Chain: 5%</span>
              <span className="text-amber-600 font-semibold">Platform: 1%</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
            <div className="flex justify-between">
              <span>Total Farm Gate Price (100% to Growers)</span>
              <span className="font-bold text-slate-900">₹{farmGateTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Refrigerated Sprinter Van Logistics</span>
              <span className="font-medium text-slate-900">₹{logisticsFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Producer Direct Fee (1%)</span>
              <span className="font-medium text-slate-900">₹{platformFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-emerald-700 bg-emerald-50 p-2 rounded-lg font-semibold">
              <span>Middleman Markup Eliminated</span>
              <span>-₹{middlemanSaved.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-baseline pt-3 border-t border-slate-200 text-slate-900">
              <div>
                <span className="text-xs text-slate-400 block uppercase font-bold">Total Payable</span>
                <span className="text-2xl font-bold">₹{totalPayable.toFixed(2)}</span>
              </div>
              <span className="text-xs text-slate-400">Inclusive of GST</span>
            </div>
          </div>

          {/* Escrow Guarantee Box */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-emerald-700 text-[20px] shrink-0">verified_user</span>
            <p className="leading-relaxed">
              Your funds remain protected in escrow. Payment is released to farmers only after you inspect produce crispness at your door.
            </p>
          </div>

          {/* Place Order CTA: Large, tactile, obvious */}
          <button
            onClick={() => onPlaceOrder(totalPayable)}
            className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <span>Place Order &amp; Lock Harvest Escrow</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>

          <p className="text-[11px] text-center text-slate-400">
            One-tap dispatch confirmation. You may reject any batch upon delivery with 0 fee.
          </p>
        </div>
      </div>
    </div>
  );
};
