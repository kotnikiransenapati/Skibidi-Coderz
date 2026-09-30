import React, { useState } from 'react';
import { ActiveScreen, RolePanel } from '../types';
import { useAuth } from '../contexts/AuthContext.tsx';
import { RoleSwitcherBar } from './RoleSwitcherBar';

interface HeaderProps {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  cartCount: number;
  openCartDrawer: () => void;
  openAddressModal: () => void;
  currentAddress: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentRole?: RolePanel;
  onSelectRole?: (role: RolePanel) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeScreen,
  setActiveScreen,
  cartCount,
  openCartDrawer,
  openAddressModal,
  currentAddress,
  searchQuery,
  setSearchQuery,
  currentRole = 'customer',
  onSelectRole = () => {},
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, userProfile, signInWithGoogle, signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Role / Stakeholder Switcher Bar */}
      <RoleSwitcherBar
        currentRole={currentRole}
        onSelectRole={onSelectRole}
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
      />

      <div className="h-18 max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark & Location */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveScreen('landing')}
            className="flex items-center gap-2 text-emerald-800 hover:text-emerald-900 transition-colors text-left cursor-pointer"
          >
            <span className="material-symbols-outlined text-[28px] text-emerald-700">eco</span>
            <span className="text-xl font-bold tracking-tight text-slate-900">FarmDirect</span>
          </button>

          <button
            onClick={openAddressModal}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-emerald-700">location_on</span>
            <span className="truncate max-w-[160px]">{currentAddress}</span>
            <span className="material-symbols-outlined text-[14px] text-slate-400">expand_more</span>
          </button>
        </div>

        {/* Global Search */}
        <div className="hidden md:flex flex-1 max-w-sm">
          <div className="relative w-full flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-slate-400 pointer-events-none text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search produce, farm, or batch..."
              className="w-full bg-slate-100 text-slate-900 text-xs pl-9 pr-8 py-2 rounded-xl border border-transparent focus:border-emerald-600 focus:bg-white focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Zone 2: Navigation Links (Clean text links without heavy pill buttons) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          {[
            { id: 'landing', label: 'Home' },
            { id: 'marketplace', label: 'Marketplace' },
            { id: 'traceability', label: 'Farm Clusters & Traceability' },
            { id: 'community', label: 'Community' },
            { id: 'orders', label: 'My Orders' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id as ActiveScreen)}
              className={`transition-colors cursor-pointer relative py-1 text-xs font-semibold ${
                activeScreen === item.id
                  ? 'text-emerald-800 font-bold after:content-[""] after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-emerald-700'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Actions (Notifications, Cart, Profile) */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              aria-label="Harvest Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors cursor-pointer relative"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 text-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-bold text-slate-900">Harvest &amp; Dispatch Alerts</span>
                  <span className="text-emerald-700 font-semibold">2 New</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <p className="font-bold text-slate-900">Reefer Truck #4 Departed</p>
                  <p className="text-slate-500 mt-0.5">Nashik harvest locked at 3.8°C en route to Bandra.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <p className="font-bold text-slate-900">Ramesh Patel Morning Pick</p>
                  <p className="text-slate-500 mt-0.5">San Marzano tomatoes boxed in aerated crates.</p>
                </div>
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <button
            type="button"
            aria-label="Shopping Cart"
            onClick={openCartDrawer}
            className="h-10 px-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">shopping_basket</span>
            <span className="font-bold text-xs">{cartCount}</span>
          </button>

          {/* Profile / Auth */}
          <div className="relative">
            {user ? (
              <button
                type="button"
                aria-label="User Profile"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="cursor-pointer flex items-center gap-1.5"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-9 h-9 rounded-full object-cover border border-emerald-600/40 shadow-xs"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {(user.displayName || user.email || 'U').substring(0, 2).toUpperCase()}
                  </div>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => signInWithGoogle()}
                className="h-10 px-3.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-emerald-700">account_circle</span>
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {showProfileMenu && user && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 text-xs animate-fadeIn">
                <div className="p-2 border-b border-slate-100 mb-1">
                  <p className="font-bold text-slate-900 truncate">
                    {user.displayName || 'FarmDirect Patron'}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  <div className="mt-1 flex items-center justify-between text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    <span>Escrow Balance:</span>
                    <span>₹{userProfile?.escrowBalance || 2500}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveScreen('orders');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                  My Orders &amp; Escrow
                </button>
                <button
                  onClick={() => {
                    setActiveScreen('community');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">forum</span>
                  Farmer Messages
                </button>
                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    onClick={() => {
                      signOut();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-200 px-2 py-1.5 bg-white text-xs">
        <button
          onClick={() => setActiveScreen('marketplace')}
          className={`py-1 px-2 font-semibold ${activeScreen === 'marketplace' ? 'text-emerald-700' : 'text-slate-500'}`}
        >
          Marketplace
        </button>
        <button
          onClick={() => setActiveScreen('traceability')}
          className={`py-1 px-2 font-semibold ${activeScreen === 'traceability' ? 'text-emerald-700' : 'text-slate-500'}`}
        >
          Traceability
        </button>
        <button
          onClick={() => setActiveScreen('community')}
          className={`py-1 px-2 font-semibold ${activeScreen === 'community' ? 'text-emerald-700' : 'text-slate-500'}`}
        >
          Community
        </button>
        <button
          onClick={() => setActiveScreen('orders')}
          className={`py-1 px-2 font-semibold ${activeScreen === 'orders' ? 'text-emerald-700' : 'text-slate-500'}`}
        >
          Orders
        </button>
      </div>
    </header>
  );
};
