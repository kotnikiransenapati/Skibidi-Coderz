import React, { useState, useEffect } from 'react';
import { SupportTicket } from '../../supabase';
import { firestoreService } from '../../services/firestoreService';

interface ChatMessage {
  id: string;
  sender: 'executive' | 'customer';
  text: string;
  time: string;
}

export const SupportPanel: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Load and listen to real tickets from Firestore
  useEffect(() => {
    firestoreService.getSupportTickets().then((data) => {
      if (data && data.length > 0) {
        setTickets(data);
        setSelectedTicket(data[0]);
      }
    });

    const unsubscribe = firestoreService.listenSupportTickets((realTickets) => {
      if (realTickets && realTickets.length > 0) {
        setTickets(realTickets);
        setSelectedTicket((prev) => {
          if (!prev) return realTickets[0];
          const found = realTickets.find((t) => t.id === prev.id);
          return found || realTickets[0];
        });
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Live Chat Simulator state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'customer',
      text: "Hello, I wanted to double check the temperature of my A2 milk before opening the sealed crate. Has cold-chain been maintained?",
      time: '12 mins ago',
    },
    {
      id: 'm2',
      sender: 'executive',
      text: "Hello Priya! Yes, our live IoT BLE tag confirms the cargo interior has remained continuously at 3.4°C since leaving the farm gate. Your escrow funds remain 100% protected until you verify crispness.",
      time: '10 mins ago',
    },
  ]);
  const [replyText, setReplyText] = useState('');

  // Call Driver Dialog Simulator
  const [isCallingDriver, setIsCallingDriver] = useState(false);

  const handleResolveAction = async (ticketId: string, action: 'resolved' | 'refunded' | 'replacement') => {
    const updated = tickets.map((t) =>
      t.id === ticketId
        ? {
            ...t,
            status: (action === 'replacement' ? 'resolved' : action) as any,
          }
        : t
    );
    setTickets(updated);
    const curr = updated.find((t) => t.id === ticketId);
    if (curr) setSelectedTicket(curr);

    let resolutionNote = '';
    if (action === 'refunded') {
      resolutionNote = `100% Escrow Refund executed for Order #${curr?.orderId}. Credited to customer escrow wallet instantly.`;
      setActionNotice(resolutionNote);
    } else if (action === 'replacement') {
      resolutionNote = `Fresh replacement harvest crate dispatched from Bandra Micro-Hub #12 via Electric Trike ET-09.`;
      setActionNotice(resolutionNote);
    } else {
      resolutionNote = `Ticket #${ticketId} closed with verified cold-chain certificate (3.4°C mean temperature).`;
      setActionNotice(resolutionNote);
    }

    setTimeout(() => setActionNotice(null), 6000);

    try {
      await firestoreService.resolveSupportTicket(
        ticketId,
        action === 'replacement' ? 'resolved' : action,
        resolutionNote
      );
      console.log('Ticket resolution saved to Firestore for ticket:', ticketId);
    } catch (err) {
      console.error('Failed to sync ticket resolution to Firestore:', err);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'executive',
      text: replyText,
      time: 'Just now',
    };
    setMessages((prev) => [...prev, newMsg]);
    setReplyText('');

    // Customer simulated reply after 1.5s
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-reply-${Date.now()}`,
          sender: 'customer',
          text: 'Thank you for the quick verification! The crate arrived super crisp and cold. Appreciate the escrow protection!',
          time: 'Just now',
        },
      ]);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-blue-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold mb-2">
            <span className="material-symbols-outlined text-[16px]">support_agent</span>
            <span>Customer Executive Desk • Operations Command</span>
          </div>
          <h2 className="text-2xl font-bold">Cold-Chain Incident &amp; Escrow Arbitration</h2>
          <p className="text-blue-100 text-xs mt-1 max-w-xl">
            Live delivery assistance, reefer temperature alert triage, driver intervention, and 100% escrow customer satisfaction guarantees.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-blue-800/80 border border-blue-600 text-xs font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Queue Online</span>
          </div>
        </div>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between animate-fadeIn shadow-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-emerald-700">verified</span>
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="cursor-pointer">✕</button>
        </div>
      )}

      {/* Main Grid: Ticket Queue (5 cols) & Active Case (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Ticket Queue */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Dispute &amp; Inquiry Queue</h3>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              {tickets.filter((t) => t.status !== 'resolved').length} Open
            </span>
          </div>

          <div className="space-y-2">
            {tickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedTicket?.id === t.id
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-500'
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
                  <span>Temp: {t.reeferTempSnapshot || '3.4°C'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active Ticket Details, Arbitration, and Live Chat */}
        {selectedTicket ? (
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">
                  Case Management
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Ticket #{selectedTicket.id} (Order #{selectedTicket.orderId})
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Executive Assigned:</span>
                <span className="text-xs font-bold text-slate-900">{selectedTicket.assignedExecutive || 'Desk Executive #02'}</span>
              </div>
            </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Customer:</span>
              <span className="font-bold text-slate-900">{selectedTicket.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Category:</span>
              <span className="font-semibold text-slate-800 uppercase">{selectedTicket.issueType.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Reefer Telemetry Snapshot:</span>
              <span className="font-bold text-emerald-700">{selectedTicket.reeferTempSnapshot || '3.4°C'}</span>
            </div>
            <p className="pt-2 border-t border-slate-200 text-slate-700 leading-relaxed">
              <strong>Incident Description:</strong> {selectedTicket.description}
            </p>
          </div>

          {/* Arbitration Action Buttons */}
          <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 space-y-3">
            <h4 className="font-bold text-xs text-blue-900 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">gavel</span>
              Customer Escrow Guarantee Arbitration
            </h4>

            <div className="flex flex-wrap gap-2 text-xs">
              <button
                disabled={selectedTicket.status === 'refunded'}
                onClick={() => handleResolveAction(selectedTicket.id, 'refunded')}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-lg cursor-pointer transition-colors shadow-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">currency_rupee</span>
                <span>Issue 100% Escrow Refund</span>
              </button>

              <button
                onClick={() => handleResolveAction(selectedTicket.id, 'replacement')}
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg cursor-pointer transition-colors shadow-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">autorenew</span>
                <span>Dispatch Replacement Crate</span>
              </button>

              <button
                disabled={selectedTicket.status === 'resolved'}
                onClick={() => handleResolveAction(selectedTicket.id, 'resolved')}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-lg cursor-pointer transition-colors shadow-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Verify Cold-Chain &amp; Close</span>
              </button>
            </div>
          </div>

          {/* Interactive Chat with Customer */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-blue-600">chat</span>
                Direct Executive Chat with {selectedTicket.customerName}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">
                Active Live Session
              </span>
            </div>

            <div className="p-4 space-y-3 h-48 overflow-y-auto bg-slate-50 text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'executive' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      m.sender === 'executive'
                        ? 'bg-blue-600 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs'
                    }`}
                  >
                    <p className="leading-relaxed">{m.text}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendReply} className="p-2 bg-white border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type response to customer..."
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors shadow-xs"
              >
                Send
              </button>
            </form>
          </div>

          {/* Driver Intercom Quick Connect */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="material-symbols-outlined text-slate-500 text-[18px]">phone_in_talk</span>
              <span>Reefer Driver Hotline: +91 98230 11204 (Santosh Yadav)</span>
            </div>
            <button
              onClick={() => {
                setIsCallingDriver(true);
                setTimeout(() => setIsCallingDriver(false), 3000);
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg cursor-pointer"
            >
              {isCallingDriver ? 'Connecting VoIP...' : 'Call Driver'}
            </button>
          </div>
        </div>
      ) : (
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          No active ticket selected from the queue.
        </div>
      )}
    </div>
  </div>
);
};
