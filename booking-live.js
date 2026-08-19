const SUPABASE_URL='https://zulbqeqmpvivsdwqmyhn.supabase.co';
const SUPABASE_KEY='sb_publishable_UkXuvZaI0lJcZSCFWvgAtw_Mm6d4HVU';
window.MEBooking={
  client:null,
  async init(){
    if(!window.supabase?.createClient) throw new Error('Supabase client failed to load');
    this.client=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
    return this.client;
  },
  bookingId(){return new URLSearchParams(location.search).get('booking')},
  async session(){const {data,error}=await this.client.auth.getSession();if(error)throw error;return data.session},
  async requireSession(){const s=await this.session();if(!s)throw new Error('Please sign in to use live booking actions.');return s},
  money(cents){return '$'+((Number(cents)||0)/100).toFixed(2)},
  fmtDate(value){if(!value)return '—';return new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric',year:'numeric'}).format(new Date(value))},
  fmtTime(value){if(!value)return '—';return new Intl.DateTimeFormat(undefined,{hour:'numeric',minute:'2-digit'}).format(new Date(value))},
  async loadMenteeBooking(id){await this.requireSession();const {data,error}=await this.client.from('mentee_session_feed').select('*').eq('id',id).single();if(error)throw error;return data},
  async loadMentorBooking(id){await this.requireSession();const {data,error}=await this.client.from('mentor_session_feed').select('*').eq('id',id).single();if(error)throw error;return data},
  async loadBooking(id){await this.requireSession();const {data,error}=await this.client.from('bookings').select('*').eq('id',id).single();if(error)throw error;return data},
  async loadEvents(id){await this.requireSession();const {data,error}=await this.client.from('booking_events').select('*').eq('booking_id',id).order('created_at',{ascending:false});if(error)throw error;return data||[]},
  async loadReschedules(id){await this.requireSession();const {data,error}=await this.client.from('booking_reschedule_requests').select('*').eq('booking_id',id).order('created_at',{ascending:false});if(error)throw error;return data||[]},
  async loadNoShows(id){await this.requireSession();const {data,error}=await this.client.from('booking_no_show_reports').select('*').eq('booking_id',id).order('created_at',{ascending:false});if(error)throw error;return data||[]},
  async requestReschedule(id,proposed,reason){await this.requireSession();const {data,error}=await this.client.rpc('request_booking_reschedule',{p_booking_id:id,p_proposed_starts_at:proposed||null,p_reason:reason||null});if(error)throw error;return data},
  async resolveReschedule(id,approve,newStart,reason){await this.requireSession();const {error}=await this.client.rpc('resolve_booking_reschedule',{p_request_id:id,p_approve:!!approve,p_new_starts_at:newStart||null,p_internal_reason:reason||null});if(error)throw error},
  async reportNoShow(id,party,note){await this.requireSession();const {data,error}=await this.client.rpc('report_booking_no_show',{p_booking_id:id,p_absent_party:party,p_note:note||null});if(error)throw error;return data},
  async resolveNoShow(reportId,confirm,reason){await this.requireSession();const {error}=await this.client.rpc('resolve_booking_no_show',{p_report_id:reportId,p_confirm:!!confirm,p_internal_reason:reason});if(error)throw error},
  async cancel(id,reason){await this.requireSession();const {error}=await this.client.rpc('cancel_mentorship_booking',{p_booking_id:id,p_reason:reason||'Cancelled by participant'});if(error)throw error},
  async complete(id){await this.requireSession();const {error}=await this.client.rpc('complete_mentorship_booking',{p_booking_id:id});if(error)throw error},
  async isAdmin(){await this.requireSession();const {data,error}=await this.client.rpc('is_platform_admin');if(error)throw error;return !!data},
  async adminCredit(userId,bookingId,amountCents,reason){await this.requireSession();const {error}=await this.client.rpc('admin_adjust_mentee_credit',{p_user_id:userId,p_adjustment_type:'add_credit',p_amount_cents:amountCents,p_reason:reason,p_related_booking_id:bookingId});if(error)throw error},
  async adminRefund(bookingId,percent,reason){await this.requireSession();const pct=Number(percent);const decision=pct>=100?'full_refund':pct>0?'partial_refund':'denied';const {error}=await this.client.rpc('admin_override_refund',{p_booking_id:bookingId,p_decision:decision,p_refund_percent:pct,p_reason:reason});if(error)throw error}
};