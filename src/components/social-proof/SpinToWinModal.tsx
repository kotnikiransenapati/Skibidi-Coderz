import React, { useState } from 'react';
import { couponAttributionService, SPIN_WHEEL_REWARDS } from '../../services/couponAttributionService';

interface SpinToWinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardClaimed: (couponCode: string) => void;
}

export const SpinToWinModal: React.FC<SpinToWinModalProps> = ({
  isOpen,
  onClose,
  onRewardClaimed,
}) => {
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [rotationDegrees, setRotationDegrees] = useState<number>(0);
  const [wonReward, setWonReward] = useState<{
    label: string;
    couponCode: string;
    discountDescription: string;
  } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (isSpinning || wonReward) return;

    setIsSpinning(true);
    const { reward, index, uniqueCoupon } = couponAttributionService.spinReward();

    // Calculate rotation: 5 full spins (1800 deg) + segment target
    const segmentAngle = 360 / SPIN_WHEEL_REWARDS.length;
    // Align wheel so top pointer lands on the segment
    const targetSegmentOffset = 360 - index * segmentAngle - segmentAngle / 2;
    const totalRotation = 1800 + targetSegmentOffset;

    setRotationDegrees(totalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWonReward({
        label: reward.label,
        couponCode: uniqueCoupon,
        discountDescription: reward.discountDescription,
      });
      onRewardClaimed(uniqueCoupon);
    }, 4000);
  };

  const copyCoupon = () => {
    if (wonReward) {
      navigator.clipboard?.writeText(wonReward.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden text-center relative p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-colors"
        >
          ✕
        </button>

        {/* Header */}
        <div>
          <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
            Harvest Bounty Celebration
          </span>
          <h3 className="text-2xl font-bold text-slate-900 mt-2">
            Spin to Win Grower Credit!
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Every spin wins! Unlock 100% verified single-use credits valid for 7 days.
          </p>
        </div>

        {/* The Wheel */}
        <div className="relative w-64 h-64 mx-auto my-2">
          {/* Top Pointer */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-red-600 drop-shadow-md"></div>

          {/* Wheel Graphic */}
          <div
            className="w-full h-full rounded-full border-4 border-amber-400 shadow-xl overflow-hidden relative"
            style={{
              transform: `rotate(${rotationDegrees}deg)`,
              transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none',
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {SPIN_WHEEL_REWARDS.map((item, idx) => {
                const angle = 360 / SPIN_WHEEL_REWARDS.length;
                const startAngle = idx * angle;
                const endAngle = (idx + 1) * angle;

                const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
                const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
                const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
                const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);

                const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                return (
                  <g key={item.couponCode}>
                    <path d={pathData} fill={item.color} />
                    <text
                      x="50"
                      y="20"
                      fill="#ffffff"
                      fontSize="4.2"
                      fontWeight="bold"
                      textAnchor="middle"
                      transform={`rotate(${startAngle + angle / 2}, 50, 50)`}
                    >
                      {item.label}
                    </text>
                  </g>
                );
              })}
            </svg>
            <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-white border-2 border-slate-300 shadow-inner flex items-center justify-center font-bold text-xs text-slate-800">
              🌿
            </div>
          </div>
        </div>

        {/* Won State or Spin Trigger */}
        {wonReward ? (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3 animate-fadeIn">
            <span className="text-2xl">🎉</span>
            <h4 className="font-bold text-emerald-900 text-sm">
              You Won: {wonReward.label}!
            </h4>
            <p className="text-xs text-emerald-800">{wonReward.discountDescription}</p>

            <div className="flex items-center justify-center gap-2 bg-white px-3 py-2 rounded-xl border border-emerald-300">
              <span className="font-mono font-bold text-emerald-900 text-sm tracking-wider">
                {wonReward.couponCode}
              </span>
              <button
                type="button"
                onClick={copyCoupon}
                className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
            >
              Apply at Checkout
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={isSpinning}
            onClick={handleSpin}
            className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg cursor-pointer transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            {isSpinning ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Spinning the Harvest Wheel...</span>
              </>
            ) : (
              <>
                <span>SPIN LUCKY WHEEL NOW</span>
                <span className="material-symbols-outlined text-[18px]">casino</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
