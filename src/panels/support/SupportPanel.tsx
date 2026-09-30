import React, { useState } from 'react';
import { ticketsService, SupportTicket } from '../../supabase';

export const SupportPanel: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>(ticketsService.getTickets());
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket>(tickets[0]);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleResolve = (ticketId: string, action: 'resolved' | 'refunded') => {
    const updated = ticketsService.resolveTicket(ticketId, action);
    setTickets(updated);
    const curr = updated.find((t) => t.id === ticketId);
    if (curr) setSelectedTicket(curr);

    setActionNotice(
      action === 'refunded'
        ? `Order #${curr?.orderId}: 100% Escrow refund executed to customer account. Cooperative notified.`
        : `Ticket #${ticketId} marked resolved. Cold-chain audit log attached.`
    );
    setTimeout(() => setActionNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-blue-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold mb-2">
            <span className="material-symbols-outlined text-[16px]">support_agent</span>
            <span>Support Operations &amp; Crispness Arbitration Desk</span>
          </div>
          <h2 className="text-2xl font-bold">Cold-Chain Incident &amp; Escrow Resolution</h2>
          <p className="text-blue-100 text-xs mt-1 max-w-xl">
            Real-time delivery assistance, reefer temperature alert triage, and instant escrow customer guarantees.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-blue-800/80 border border-blue-600 text-xs font-bold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Avg Response: 4.2 mins</span>
          </span>
        </div>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-emerald-700">verified</span>
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)}>✕</button>
        </div>
      )}

      {/* Main Grid: Ticket Queue & Ticket Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ticket List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Active Inquiries &amp; Alerts</h3>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              {tickets.filter((t) => t.status !== 'resolved').length} Active
            </span>
          </div>

          <div className="space-y-2">
            {tickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedTicket.id === t.id
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900">{t.id} • Order {t.orderId}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : t.status === 'refunded'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {t.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-800 truncate">{t.customerName}</p>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{t.description}</p>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Priority: {t.priority.toUpperCase()}</span>
                  <span>{t.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Ticket Action Panel (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">
                Arbitration Case
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Ticket #{selectedTicket.id} (Order #{selectedTicket.orderId})
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Assigned Executive:</span>
              <span className="text-xs font-bold text-slate-900">{selectedTicket.assignedExecutive}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Customer:</span>
              <span className="font-bold text-slate-900">{selectedTicket.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Issue Category:</span>
              <span className="font-semibold text-slate-900 uppercase">{selectedTicket.issueType.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Reefer Telemetry Snapshot:</span>
              <span className="font-bold text-emerald-700">{selectedTicket.reeferTempSnapshot || '3.4°C'}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 text-slate-700 leading-relaxed">
              <strong>Incident Description:</strong>
              <p className="mt-1">{selectedTicket.description}</p>
            </div>
          </div>

          {/* Arbitration Actions */}
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-3">
            <h4 className="font-bold text-xs text-blue-900 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">gavel</span>
              Escrow Protection Arbitration Actions
            </h4>

            <p className="text-[11px] text-blue-800 leading-relaxed">
              All FarmDirect customer orders are protected by smart escrow. If produce crispness does not match farm gate quality or reefer temperature exceeded 5.0°C, you can authorize an immediate 100% refund.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                disabled={selectedTicket.status === 'refunded'}
                onClick={() => handleResolve(selectedTicket.id, 'refunded')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-lg text-xs cursor-pointer transition-colors shadow-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">currency_rupee</span>
                <span>Issue 100% Escrow Refund</span>
              </button>

              <button
                disabled={selectedTicket.status === 'resolved'}
                onClick={() => handleResolve(selectedTicket.id, 'resolved')}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-lg text-xs cursor-pointer transition-colors shadow-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Verify Cold-Chain &amp; Close Ticket</span>
              </button>
            </div>
          </div>

          {/* Driver Intercom Quick Connect */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="material-symbols-outlined text-slate-500 text-[18px]">phone_in_talk</span>
              <span>Reefer Driver Hotline: +91 98230 11204 (Santosh Yadav)</span>
            </div>
            <button
              onClick={() => alert('Direct VoIP call initiated to driver cabin.')}
              className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 font-bold rounded text-slate-800"
            >
              Call Driver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
