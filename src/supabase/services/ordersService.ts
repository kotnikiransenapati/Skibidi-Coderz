import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { OrderRecord } from '../../types';

export const ordersService = {
  async fetchOrders(): Promise<OrderRecord[] | null> {
    if (!isSupabaseConfigured) {
      // Fetch from local Express backend API
      try {
        const res = await fetch('/api/orders');
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend orders fetch failed, using state fallback', e);
      }
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as any) || null;
    } catch (err) {
      console.warn('Supabase fetchOrders error, falling back:', err);
      return null;
    }
  },

  async releaseEscrow(orderId: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      try {
        const res = await fetch(`/api/orders/${orderId}/release-escrow`, { method: 'POST' });
        return res.ok;
      } catch (err) {
        console.error('Failed to release escrow via backend:', err);
        return false;
      }
    }

    try {
      const { error } = await (supabase.from('orders') as any)
        .update({ escrow_status: 'Inspected & Released' })
        .eq('id', orderId);

      return !error;
    } catch (err) {
      console.error('Supabase escrow release error:', err);
      return false;
    }
  },

  async submitRating(orderId: string, rating: number, comment?: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      try {
        const res = await fetch(`/api/orders/${orderId}/rate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rating, comment }),
        });
        return res.ok;
      } catch (err) {
        console.error('Failed to submit rating via backend:', err);
        return false;
      }
    }

    try {
      const { error } = await (supabase.from('orders') as any)
        .update({
          rating,
          review_comment: comment,
          rated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      return !error;
    } catch (err) {
      console.error('Supabase rating submit error:', err);
      return false;
    }
  },
};
