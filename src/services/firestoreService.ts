import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { ProduceItem, OrderRecord, FarmCluster } from '../types';
import { INITIAL_PRODUCE, INITIAL_ORDERS, REGIONAL_CLUSTERS } from '../data/mockData';
import { ReeferFleetUnit, FLEET_DATABASE } from '../backend/services/coldChainService';
import { FarmerDispatchLot } from '../supabase/services/farmerService';
import { SupportTicket } from '../supabase/services/ticketsService';

const INITIAL_FARMER_DISPATCHES: FarmerDispatchLot[] = [
  {
    id: 'LOT-9921',
    farmerId: 'ramesh',
    farmerName: 'Ramesh Patel',
    cluster: 'Nashik Organic Syndicate #4',
    crop: 'San Marzano Vine Tomatoes',
    crates: 32,
    weightKg: 640,
    harvestTime: 'Today 05:30 AM',
    coldClass: 'Fruits (8-10°C)',
    vanAssigned: 'MH-15-EG-4402',
    escrowExpected: 28800,
    escrowSettled: false,
    status: 'Reefer Dispatched',
  },
  {
    id: 'LOT-9918',
    farmerId: 'rajesh',
    farmerName: 'Rajesh Sharma',
    cluster: 'Himachal Highland Orchards',
    crop: 'Shimla Royal Delicious Apples',
    crates: 50,
    weightKg: 1000,
    harvestTime: 'Yesterday 04:00 PM',
    coldClass: 'Fruits (8-10°C)',
    vanAssigned: 'HP-14-B-9901',
    escrowExpected: 220000,
    escrowSettled: true,
    status: 'Delivered & Settled',
  },
  {
    id: 'LOT-9915',
    farmerId: 'anand',
    farmerName: 'Bhavik Patel',
    cluster: 'Gir Vedic Gaushala',
    crop: 'A2 Gir Raw Milk (Glass Cans)',
    crates: 40,
    weightKg: 400,
    harvestTime: 'Today 04:30 AM',
    coldClass: 'Dairy (1-3°C)',
    vanAssigned: 'GJ-07-K-8812',
    escrowExpected: 38000,
    escrowSettled: false,
    status: 'Reefer Dispatched',
  },
];

const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-401',
    orderId: 'FD-8740',
    customerName: 'Priya Sharma (Bandra)',
    issueType: 'temperature_breach',
    status: 'open',
    priority: 'high',
    description: 'Cargo seal indicates 4.8°C at delivery threshold. Requesting instant escrow crispness verification.',
    assignedExecutive: 'Kavita Joshi',
    reeferTempSnapshot: '4.8°C (At Threshold)',
    createdAt: '18 mins ago',
  },
  {
    id: 'TCK-398',
    orderId: 'FD-8612',
    customerName: 'Rohan Mehta (Juhu)',
    issueType: 'crispness_dispute',
    status: 'investigating',
    priority: 'medium',
    description: 'Baby Spinach leaves arrived slightly wilted; requested replacement harvest crate from Bandra hub.',
    assignedExecutive: 'Arun Varma',
    reeferTempSnapshot: '3.6°C',
    createdAt: '1 hour ago',
  },
  {
    id: 'TCK-385',
    orderId: 'FD-8490',
    customerName: 'Ananya Deshmukh (Worli)',
    issueType: 'delivery_delay',
    status: 'resolved',
    priority: 'low',
    description: 'Ghat transit traffic delayed van by 25 mins. Temperature remained locked at 3.2°C; verified intact.',
    assignedExecutive: 'Kavita Joshi',
    resolution: 'Delivered in pristine condition with 10% credit.',
    createdAt: 'Yesterday',
    reeferTempSnapshot: '3.2°C',
  },
];

export const firestoreService = {
  // ================= PRODUCE ITEMS =================
  async getProduceItems(): Promise<ProduceItem[]> {
    try {
      const snap = await getDocs(collection(db, 'produce_items'));
      if (snap.empty) {
        await this.seedProduceItems();
        return INITIAL_PRODUCE;
      }
      return snap.docs.map((d) => d.data() as ProduceItem);
    } catch (error) {
      console.warn('Falling back from firestore produce:', error);
      return INITIAL_PRODUCE;
    }
  },

  async seedProduceItems(): Promise<void> {
    try {
      for (const item of INITIAL_PRODUCE) {
        await setDoc(doc(db, 'produce_items', item.id), item);
      }
    } catch (error) {
      console.warn('Error seeding produce items to Firestore:', error);
    }
  },

  // ================= ORDERS & ESCROW =================
  async getOrders(): Promise<OrderRecord[]> {
    try {
      const snap = await getDocs(collection(db, 'orders'));
      if (snap.empty) {
        await this.seedOrders();
        return INITIAL_ORDERS;
      }
      return snap.docs.map((d) => d.data() as OrderRecord);
    } catch (error) {
      console.warn('Falling back from firestore orders:', error);
      return INITIAL_ORDERS;
    }
  },

  listenOrders(callback: (orders: OrderRecord[]) => void): () => void {
    const q = collection(db, 'orders');
    return onSnapshot(
      q,
      (snap) => {
        if (!snap.empty) {
          const orders = snap.docs.map((d) => d.data() as OrderRecord);
          callback(orders);
        }
      },
      (err) => {
        console.warn('Orders listener notice:', err);
      }
    );
  },

  async saveOrder(order: OrderRecord): Promise<void> {
    try {
      await setDoc(doc(db, 'orders', order.id), order);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `orders/${order.id}`);
    }
  },

  async releaseOrderEscrow(orderId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        escrowStatus: 'Inspected & Released',
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  },

  async rateOrder(orderId: string, rating: number, comment?: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        rating,
        reviewComment: comment || '',
        ratedAt: 'Just now',
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  },

  async seedOrders(): Promise<void> {
    try {
      for (const order of INITIAL_ORDERS) {
        await setDoc(doc(db, 'orders', order.id), order);
      }
    } catch (error) {
      console.warn('Error seeding initial orders to Firestore:', error);
    }
  },

  // ================= FARMER DISPATCHES =================
  async getFarmerDispatches(): Promise<FarmerDispatchLot[]> {
    try {
      const snap = await getDocs(collection(db, 'farmer_dispatches'));
      if (snap.empty) {
        await this.seedDispatches();
        return INITIAL_FARMER_DISPATCHES;
      }
      return snap.docs.map((d) => d.data() as FarmerDispatchLot);
    } catch (error) {
      console.warn('Falling back from firestore dispatches:', error);
      return INITIAL_FARMER_DISPATCHES;
    }
  },

  listenFarmerDispatches(callback: (lots: FarmerDispatchLot[]) => void): () => void {
    const col = collection(db, 'farmer_dispatches');
    return onSnapshot(
      col,
      (snap) => {
        if (!snap.empty) {
          callback(snap.docs.map((d) => d.data() as FarmerDispatchLot));
        }
      },
      (err) => console.warn('Dispatches listener notice:', err)
    );
  },

  async createFarmerDispatch(lot: FarmerDispatchLot): Promise<void> {
    try {
      await setDoc(doc(db, 'farmer_dispatches', lot.id), lot);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `farmer_dispatches/${lot.id}`);
    }
  },

  async seedDispatches(): Promise<void> {
    try {
      for (const lot of INITIAL_FARMER_DISPATCHES) {
        await setDoc(doc(db, 'farmer_dispatches', lot.id), lot);
      }
    } catch (error) {
      console.warn('Error seeding dispatches to Firestore:', error);
    }
  },

  // ================= FLEET TELEMETRY =================
  async getFleetTelemetry(): Promise<ReeferFleetUnit[]> {
    try {
      const snap = await getDocs(collection(db, 'fleet_telemetry'));
      if (snap.empty) {
        await this.seedFleetTelemetry();
        return FLEET_DATABASE;
      }
      return snap.docs.map((d) => d.data() as ReeferFleetUnit);
    } catch (error) {
      console.warn('Falling back from firestore fleet telemetry:', error);
      return FLEET_DATABASE;
    }
  },

  listenFleetTelemetry(callback: (units: ReeferFleetUnit[]) => void): () => void {
    const col = collection(db, 'fleet_telemetry');
    return onSnapshot(
      col,
      (snap) => {
        if (!snap.empty) {
          callback(snap.docs.map((d) => d.data() as ReeferFleetUnit));
        }
      },
      (err) => console.warn('Fleet listener notice:', err)
    );
  },

  async updateFleetUnit(vanNumber: string, updateData: Partial<ReeferFleetUnit>): Promise<void> {
    try {
      await updateDoc(doc(db, 'fleet_telemetry', vanNumber), updateData);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `fleet_telemetry/${vanNumber}`);
    }
  },

  async seedFleetTelemetry(): Promise<void> {
    try {
      for (const unit of FLEET_DATABASE) {
        await setDoc(doc(db, 'fleet_telemetry', unit.vanNumber), unit);
      }
    } catch (error) {
      console.warn('Error seeding fleet telemetry to Firestore:', error);
    }
  },

  // ================= SUPPORT TICKETS =================
  async getSupportTickets(): Promise<SupportTicket[]> {
    try {
      const snap = await getDocs(collection(db, 'support_tickets'));
      if (snap.empty) {
        await this.seedSupportTickets();
        return INITIAL_SUPPORT_TICKETS;
      }
      return snap.docs.map((d) => d.data() as SupportTicket);
    } catch (error) {
      console.warn('Falling back from firestore support tickets:', error);
      return INITIAL_SUPPORT_TICKETS;
    }
  },

  listenSupportTickets(callback: (tickets: SupportTicket[]) => void): () => void {
    const col = collection(db, 'support_tickets');
    return onSnapshot(
      col,
      (snap) => {
        if (!snap.empty) {
          callback(snap.docs.map((d) => d.data() as SupportTicket));
        }
      },
      (err) => console.warn('Support tickets listener notice:', err)
    );
  },

  async resolveSupportTicket(
    ticketId: string,
    action: 'resolved' | 'refunded',
    resolutionNote: string
  ): Promise<void> {
    try {
      await updateDoc(doc(db, 'support_tickets', ticketId), {
        status: action,
        resolution: resolutionNote,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `support_tickets/${ticketId}`);
    }
  },

  async seedSupportTickets(): Promise<void> {
    try {
      for (const ticket of INITIAL_SUPPORT_TICKETS) {
        await setDoc(doc(db, 'support_tickets', ticket.id), ticket);
      }
    } catch (error) {
      console.warn('Error seeding support tickets to Firestore:', error);
    }
  },

  // ================= FARM CLUSTERS =================
  async getFarmClusters(): Promise<FarmCluster[]> {
    try {
      const snap = await getDocs(collection(db, 'farm_clusters'));
      if (snap.empty) {
        await this.seedFarmClusters();
        return REGIONAL_CLUSTERS;
      }
      return snap.docs.map((d) => d.data() as FarmCluster);
    } catch (error) {
      console.warn('Falling back from firestore clusters:', error);
      return REGIONAL_CLUSTERS;
    }
  },

  async seedFarmClusters(): Promise<void> {
    try {
      for (const cluster of REGIONAL_CLUSTERS) {
        await setDoc(doc(db, 'farm_clusters', cluster.id), cluster);
      }
    } catch (error) {
      console.warn('Error seeding farm clusters to Firestore:', error);
    }
  },

  // ================= BOOTSTRAP ALL COLLECTIONS =================
  async initializeDatabase(): Promise<void> {
    try {
      await Promise.all([
        this.getProduceItems(),
        this.getOrders(),
        this.getFarmerDispatches(),
        this.getFleetTelemetry(),
        this.getSupportTickets(),
        this.getFarmClusters(),
      ]);
      console.log('Real Firestore database initialized and seeded with production sample data.');
    } catch (error) {
      console.warn('Notice during database bootstrap:', error);
    }
  },
};
