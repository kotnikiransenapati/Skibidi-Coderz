export interface SupportTicket {
  id: string;
  orderId: string;
  customerName: string;
  issueType: 'temperature_breach' | 'crispness_dispute' | 'delivery_delay' | 'general';
  status: 'open' | 'investigating' | 'resolved' | 'refunded';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  assignedExecutive: string;
  createdAt: string;
  reeferTempSnapshot?: string;
  resolution?: string;
}

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-4019',
    orderId: 'FD-8740',
    customerName: 'Priya Sharma',
    issueType: 'crispness_dispute',
    status: 'investigating',
    priority: 'high',
    description: 'Customer requested secondary check on A2 Milk seal temperature upon arrival.',
    assignedExecutive: 'Kavita Joshi',
    createdAt: '12 mins ago',
    reeferTempSnapshot: '3.4°C (Verified Safe)',
  },
  {
    id: 'TCK-3982',
    orderId: 'FD-8304',
    customerName: 'Devansh Roy',
    issueType: 'delivery_delay',
    status: 'resolved',
    priority: 'medium',
    description: 'Western Express Highway congestion alert; driver slowed by 15 mins. Temp maintained at 3.1°C.',
    assignedExecutive: 'Arun Varma',
    createdAt: '1 hour ago',
    reeferTempSnapshot: '3.1°C',
  },
  {
    id: 'TCK-3950',
    orderId: 'FD-8120',
    customerName: 'Meera Nambiar',
    issueType: 'general',
    status: 'resolved',
    priority: 'low',
    description: 'Inquiry regarding chemical residue lab certification sheet for Shimla apples batch.',
    assignedExecutive: 'Kavita Joshi',
    createdAt: 'Yesterday',
    reeferTempSnapshot: '4.0°C',
  },
];

export const ticketsService = {
  getTickets(): SupportTicket[] {
    return INITIAL_TICKETS;
  },

  resolveTicket(ticketId: string, resolution: 'resolved' | 'refunded'): SupportTicket[] {
    return INITIAL_TICKETS.map((t) =>
      t.id === ticketId ? { ...t, status: resolution } : t
    );
  },
};
