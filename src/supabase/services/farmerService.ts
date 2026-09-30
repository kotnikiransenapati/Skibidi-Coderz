export interface FarmerDispatchLot {
  id: string;
  farmerId: string;
  farmerName: string;
  cluster: string;
  crop: string;
  crates: number;
  weightKg: number;
  harvestTime: string;
  coldClass: 'Leafy (2-4°C)' | 'Fruits (8-10°C)' | 'Dairy (1-3°C)';
  vanAssigned?: string;
  escrowExpected: number;
  escrowSettled: boolean;
  status: 'Ready at Farm Gate' | 'Reefer Dispatched' | 'Consolidated' | 'Delivered & Settled';
}

export const INITIAL_FARMER_LOTS: FarmerDispatchLot[] = [
  {
    id: 'LOT-901',
    farmerId: 'ramesh',
    farmerName: 'Ramesh Patel',
    cluster: 'Nashik Organic Syndicate',
    crop: 'San Marzano Vine Tomatoes',
    crates: 28,
    weightKg: 560,
    harvestTime: 'Today 5:30 AM',
    coldClass: 'Leafy (2-4°C)',
    vanAssigned: 'MH-15-EG-4402',
    escrowExpected: 25200,
    escrowSettled: false,
    status: 'Reefer Dispatched',
  },
  {
    id: 'LOT-902',
    farmerId: 'ramesh',
    farmerName: 'Ramesh Patel',
    cluster: 'Nashik Organic Syndicate',
    crop: 'Crisp Hydroponic Butterhead',
    crates: 15,
    weightKg: 120,
    harvestTime: 'Today 6:00 AM',
    coldClass: 'Leafy (2-4°C)',
    vanAssigned: 'MH-15-EG-4402',
    escrowExpected: 14400,
    escrowSettled: false,
    status: 'Reefer Dispatched',
  },
  {
    id: 'LOT-889',
    farmerId: 'ramesh',
    farmerName: 'Ramesh Patel',
    cluster: 'Nashik Organic Syndicate',
    crop: 'Alphonso Mango Pre-Season Crates',
    crates: 40,
    weightKg: 800,
    harvestTime: 'Yesterday 4:00 PM',
    coldClass: 'Fruits (8-10°C)',
    vanAssigned: 'MH-04-AX-9912',
    escrowExpected: 72000,
    escrowSettled: true,
    status: 'Delivered & Settled',
  },
];

export const farmerService = {
  getDispatches(): FarmerDispatchLot[] {
    return INITIAL_FARMER_LOTS;
  },

  schedulePickup(lot: Omit<FarmerDispatchLot, 'id' | 'escrowSettled' | 'status'>): FarmerDispatchLot {
    const newLot: FarmerDispatchLot = {
      ...lot,
      id: `LOT-${Math.floor(1000 + Math.random() * 9000)}`,
      escrowSettled: false,
      status: 'Ready at Farm Gate',
    };
    INITIAL_FARMER_LOTS.unshift(newLot);
    return newLot;
  },
};
