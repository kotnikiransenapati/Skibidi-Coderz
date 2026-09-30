import React from 'react';
import { ActiveScreen } from '../types';

interface FooterProps {
  setActiveScreen: (screen: ActiveScreen) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveScreen }) => {
  return (
    <footer className="w-full bg-surface-container-low mt-space-xl pt-space-xl pb-space-lg border-t border-surface-container-high/60">
      <div className="max-w-7xl mx-auto px-gutter">
        {/* 3 Pillars / Guarantee Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md pb-space-xl">
          <div className="bg-surface-container-lowest p-space-lg rounded-xl flex items-start gap-space-md shadow-[0_1px_3px_0_rgba(17,24,39,0.05)] border border-outline-variant/30">
            <span className="material-symbols-outlined text-primary text-[32px] shrink-0">verified</span>
            <div>
              <h4 className="font-headline-sm text-on-surface font-semibold">100% Certified Organic</h4>
              <p className="font-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
                PGS-India &amp; NPOP laboratory certified single-origin farmers directly traceable to farm coordinates.
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-space-lg rounded-xl flex items-start gap-space-md shadow-[0_1px_3px_0_rgba(17,24,39,0.05)] border border-outline-variant/30">
            <span className="material-symbols-outlined text-secondary text-[32px] shrink-0">ac_unit</span>
            <div>
              <h4 className="font-headline-sm text-on-surface font-semibold">Cold-Chain Dispatch</h4>
              <p className="font-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
                Farm harvest to your door in refrigerated eco-pods under 18 hours preserving live enzymes.
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-space-lg rounded-xl flex items-start gap-space-md shadow-[0_1px_3px_0_rgba(17,24,39,0.05)] border border-outline-variant/30">
            <span className="material-symbols-outlined text-tertiary text-[32px] shrink-0">shield</span>
            <div>
              <h4 className="font-headline-sm text-on-surface font-semibold">FSSAI &amp; Escrow Trust</h4>
              <p className="font-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
                Funds held securely in smart escrow and disbursed directly to farmer collectives upon quality acceptance.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-space-xl py-space-xl border-t border-surface-container-high/60">
          <div className="flex flex-col gap-space-sm">
            <span className="font-label-lg text-on-surface font-bold uppercase tracking-wider text-xs">Marketplace</span>
            <button
              onClick={() => setActiveScreen('marketplace')}
              className="font-body-sm text-on-surface-variant hover:text-primary transition-colors text-left"
            >
              Seasonal Harvests
            </button>
            <button
              onClick={() => setActiveScreen('marketplace')}
              className="font-body-sm text-on-surface-variant hover:text-primary transition-colors text-left"
            >
              Heirloom Staples &amp; Grains
            </button>
            <button
              onClick={() => setActiveScreen('marketplace')}
              className="font-body-sm text-on-surface-variant hover:text-primary transition-colors text-left"
            >
              Artisanal Cold-Pressed
            </button>
            <button
              onClick={() => setActiveScreen('marketplace')}
              className="font-body-sm text-on-surface-variant hover:text-primary transition-colors text-left"
            >
              Weekly Harvest Baskets
            </button>
          </div>

          <div className="flex flex-col gap-space-sm">
            <span className="font-label-lg text-on-surface font-bold uppercase tracking-wider text-xs">Traceability &amp; Tech</span>
            <button
              onClick={() => setActiveScreen('traceability')}
              className="font-body-sm text-on-surface-variant hover:text-primary transition-colors text-left"
            >
              Regional Clusters
            </button>
            <button
              onClick={() => setActiveScreen('traceability')}
              className="font-body-sm text-on-surface-variant hover:text-primary transition-colors text-left"
            >
              Soil Health &amp; Lab Reports
            </button>
            <button
              onClick={() => setActiveScreen('traceability')}
              className="font-body-sm text-on-surface-variant hover:text-primary transition-colors text-left"
            >
              QR Code Lot Verification
            </button>
            <button
              onClick={() => setActiveScreen('traceability')}
              className="font-body-sm text-on-surface-variant hover:text-primary transition-colors text-left"
            >
              Direct Farmer Compensation
            </button>
          </div>

          <div className="flex flex-col gap-space-sm">
            <span className="font-label-lg text-on-surface font-bold uppercase tracking-wider text-xs">Community</span>
            <button
              onClick={() => setActiveScreen('community')}
              className="font-body-sm text-on-surface-variant hover:text-primary transition-colors text-left"
            >
              Farmer Diaries &amp; Audio Logs
            </button>
            <button
              onClick={() => setActiveScreen('community')}
              className="font-body-sm text-on-surface-variant hover:text-primary transition-colors text-left"
            >
              Farm Visits &amp; Volunteering
            </button>
            <button
              onClick={() => setActiveScreen('community')}
              className="font-body-sm text-on-surface-variant hover:text-primary transition-colors text-left"
            >
              Seed Preservation Network
            </button>
            <button
              onClick={() => setActiveScreen('community')}
              className="font-body-sm text-on-surface-variant hover:text-primary transition-colors text-left"
            >
              Organic Kitchen Recipes
            </button>
          </div>

          <div className="flex flex-col gap-space-sm">
            <span className="font-label-lg text-on-surface font-bold uppercase tracking-wider text-xs">Certifications &amp; Safety</span>
            <div className="flex flex-col gap-space-xs text-xs">
              <span className="font-label-sm text-primary font-semibold">FSSAI Central Lic. No. 10020022011244</span>
              <span className="font-body-sm text-on-surface-variant">NPOP India Organic Accredited</span>
              <span className="font-body-sm text-on-surface-variant">Cold-Chain Trace Compliant</span>
              <button
                onClick={() => setActiveScreen('orders')}
                className="font-body-sm text-secondary hover:underline mt-space-xs text-left"
              >
                Escrow Payout Guidelines
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md border-t border-surface-container-high/60">
          <button
            onClick={() => setActiveScreen('landing')}
            className="flex items-center gap-space-xs text-primary font-headline-sm font-semibold cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span className="material-symbols-outlined text-[22px]">spa</span>
            <span>FarmDirect Organics</span>
          </button>
          <p className="font-body-sm text-outline text-center md:text-left text-xs">
            © 2026 FarmDirect Agritech India Pvt. Ltd. Direct farm dispatch honoring ethical grower prosperity.
          </p>
          <div className="flex items-center gap-space-md">
            <span className="font-label-sm text-outline">Pure Origin</span>
            <span className="font-label-sm text-outline">•</span>
            <span className="font-label-sm text-outline">Zero Middlemen</span>
            <span className="font-label-sm text-outline">•</span>
            <span className="font-label-sm text-outline">Fair Trade</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
