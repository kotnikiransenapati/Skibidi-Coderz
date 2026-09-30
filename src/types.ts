export type ActiveScreen =
  | 'landing'
  | 'marketplace'
  | 'traceability'
  | 'community'
  | 'checkout'
  | 'orders'
  | 'farmer-panel'
  | 'admin-panel'
  | 'support-panel';

export type RolePanel = 'customer' | 'farmer' | 'admin' | 'support';

export interface ProduceItem {
  id: string;
  name: string;
  category: 'leafy' | 'fruits' | 'dairy' | 'grains' | 'special';
  badge: string;
  batchId: string;
  imageUrl: string;
  harvestTime: string;
  harvestHoursAgo: number;
  origin: string;
  farmer: string;
  price: number;
  unit: string;
  growerSharePercent: number;
  accreditation: string[];
  distanceKm: number;
  inStock: boolean;
  description?: string;
}

export interface CartItem {
  item: ProduceItem;
  quantity: number;
}

export interface FarmCluster {
  id: string;
  name: string;
  region: string;
  pin: string;
  status: 'Dispatching Now' | 'Harvest Tomorrow' | 'Curing Lots' | 'Dormant cycle';
  farmersCount: number;
  crops: string[];
  acreage: number;
  soilNpk: number;
  coordinates: string;
  transitHours: number;
  leadFarmer: string;
  leadFarmerAvatar: string;
  bio: string;
  chemicalResiduePpm: number;
  humusPercent: number;
}

export interface BatchTimelineStage {
  stageNumber: string;
  category: string;
  title: string;
  description: string;
  timestamp: string;
  statusBadge?: string;
  icon: string;
  isColdChain?: boolean;
}

export interface BatchTrace {
  batchId: string;
  title: string;
  origin: string;
  consignmentVol: string;
  coldChainTemp: string;
  eta: string;
  iconEmoji: string;
  stages: BatchTimelineStage[];
}

export interface FarmerProfile {
  id: string;
  name: string;
  role: string;
  farmName: string;
  location: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  avatar: string;
  verified: boolean;
  seasonsCount: number;
  escrowFulfillmentPercent: number;
  acreage: number;
  soilWater: string;
  quote: string;
  seasonalHarvests: string[];
  certifications: string[];
  directItems: {
    id: string;
    name: string;
    description: string;
    price: number;
    unit: string;
    image: string;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'farmer' | 'consumer' | 'system';
  farmerId?: string;
  text: string;
  timestamp: string;
  photoUrl?: string;
  photoCaption?: string;
  audioDuration?: string;
  systemTelemetry?: {
    title: string;
    hub: string;
    temp: string;
    eta: string;
  };
}

export interface OrderRecord {
  id: string;
  date: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    farmerName: string;
  }[];
  subtotal: number;
  logisticsFee: number;
  platformFee: number;
  discount: number;
  total: number;
  escrowStatus: 'Locked' | 'Inspected & Released' | 'Refunded';
  reeferTemp: string;
  slot: string;
  driverName: string;
  vanNumber: string;
  eta: string;
  rating?: number;
  reviewComment?: string;
  ratedAt?: string;
}
