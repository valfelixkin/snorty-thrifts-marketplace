
export interface ReturnRequest {
  id: string;
  order_id: string | null;
  item_id: string;
  user_id: string;
  reason: string;
  description?: string;
  status: 'pending' | 'approved' | 'denied' | 'processed';
  refund_amount?: number | null;
  created_at: string;
  updated_at: string;
}

export interface ReturnMedia {
  id: string;
  return_id: string;
  media_url: string;
  media_type: 'image' | 'video';
  created_at: string;
}
