export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      produce_items: {
        Row: {
          id: string;
          name: string;
          category: string;
          price: number;
          unit: string;
          farmer: string;
          origin: string;
          grower_share_percent: number;
          harvest_time: string;
          in_stock: boolean;
          batch_id: string;
          image_url: string;
          created_at?: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          price: number;
          unit: string;
          farmer: string;
          origin: string;
          grower_share_percent?: number;
          harvest_time?: string;
          in_stock?: boolean;
          batch_id: string;
          image_url?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['produce_items']['Insert']>;
      };
      orders: {
        Row: {
          id: string;
          user_id?: string;
          date: string;
          subtotal: number;
          logistics_fee: number;
          platform_fee: number;
          total: number;
          escrow_status: 'Locked' | 'Inspected & Released' | 'Refunded';
          reefer_temp: string;
          slot: string;
          driver_name: string;
          van_number: string;
          eta: string;
          rating?: number;
          review_comment?: string;
          rated_at?: string;
          created_at?: string;
        };
        Insert: {
          id: string;
          user_id?: string;
          date?: string;
          subtotal: number;
          logistics_fee?: number;
          platform_fee?: number;
          total: number;
          escrow_status?: 'Locked' | 'Inspected & Released' | 'Refunded';
          reefer_temp?: string;
          slot?: string;
          driver_name?: string;
          van_number?: string;
          eta?: string;
          rating?: number;
          review_comment?: string;
          rated_at?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
      };
      reefer_telemetry: {
        Row: {
          id: string;
          van_number: string;
          order_id: string;
          temperature_celsius: number;
          humidity_percent: number;
          ambient_temp_celsius: number;
          latitude: number;
          longitude: number;
          speed_kmh: number;
          tamper_seal_intact: boolean;
          battery_percent: number;
          recorded_at: string;
        };
        Insert: {
          id?: string;
          van_number: string;
          order_id: string;
          temperature_celsius: number;
          humidity_percent: number;
          ambient_temp_celsius: number;
          latitude: number;
          longitude: number;
          speed_kmh: number;
          tamper_seal_intact?: boolean;
          battery_percent?: number;
          recorded_at?: string;
        };
        Update: Partial<Database['public']['Tables']['reefer_telemetry']['Insert']>;
      };
      support_tickets: {
        Row: {
          id: string;
          order_id: string;
          customer_name: string;
          issue_type: 'temperature_breach' | 'crispness_dispute' | 'delivery_delay' | 'general';
          status: 'open' | 'investigating' | 'resolved' | 'refunded';
          priority: 'low' | 'medium' | 'high' | 'critical';
          description: string;
          assigned_executive: string;
          created_at: string;
          resolved_at?: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          customer_name: string;
          issue_type: 'temperature_breach' | 'crispness_dispute' | 'delivery_delay' | 'general';
          status?: 'open' | 'investigating' | 'resolved' | 'refunded';
          priority?: 'low' | 'medium' | 'high' | 'critical';
          description: string;
          assigned_executive?: string;
          created_at?: string;
          resolved_at?: string;
        };
        Update: Partial<Database['public']['Tables']['support_tickets']['Insert']>;
      };
      farmer_dispatches: {
        Row: {
          id: string;
          farmer_id: string;
          farmer_name: string;
          cluster_name: string;
          produce_type: string;
          crates_count: number;
          target_temp_celsius: number;
          status: 'scheduled' | 'loading' | 'in_transit' | 'dock_received';
          payout_amount: number;
          escrow_released: boolean;
          dispatch_date: string;
        };
        Insert: {
          id?: string;
          farmer_id: string;
          farmer_name: string;
          cluster_name: string;
          produce_type: string;
          crates_count: number;
          target_temp_celsius: number;
          status?: 'scheduled' | 'loading' | 'in_transit' | 'dock_received';
          payout_amount: number;
          escrow_released?: boolean;
          dispatch_date?: string;
        };
        Update: Partial<Database['public']['Tables']['farmer_dispatches']['Insert']>;
      };
    };
  };
}
