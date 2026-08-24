const SUPABASE_URL='https://zulbqeqmpvivsdwqmyhn.supabase.co';

async function stripeExpire(sessionId){
  const r=await fetch('https://api.stripe.com/v1/checkout/sessions/'+encodeURIComponent(sessionId)+'/expire',{
    method:'POST',
    headers:{'Authorization':'Bearer '+process.env.STRIPE_SECRET_KEY,'Content-Type':'application/x-www-form-urlencoded'},
    body:new URLSearchParams()
  });
  const body=await r.json().catch(()=>({}));
  if(r.ok)return {ok:true,status:body.status||'expired'};
  const msg=(body.error&&body.error.message)||'';
  // Completed/already-expired Checkout Sessions are safe terminal states.
  if(/already expired|not be expired|complete|completed/i.test(msg))return {ok:true,status:'terminal'};
  return {ok:false,error:msg||'Stripe session expiration failed'};
}

module.exports=async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  if(!process.env.STRIPE_SECRET_KEY||!process.env.SUPABASE_SERVICE_ROLE_KEY)return res.status(503).json({error:'Checkout expiry service is not configured'});
  try{
    const url=SUPABASE_URL+'/rest/v1/payments?select=id,provider_checkout_session_id,booking_id,status,bookings!inner(status,cancellation_reason,cancelled_at)&status=eq.cancelled&provider_checkout_session_id=not.is.null&bookings.status=eq.cancelled&bookings.cancellation_reason=eq.Checkout%20hold%20expired&order=updated_at.desc&limit=50';
    const q=await fetch(url,{headers:{'apikey':process.env.SUPABASE_SERVICE_ROLE_KEY,'Authorization':'Bearer '+process.env.SUPABASE_SERVICE_ROLE_KEY}});
    const rows=await q.json();
    if(!q.ok)throw new Error(rows.message||'Unable to load expired checkout sessions');
    let expired=0,terminal=0,failed=0;
    for(const row of rows){
      const id=row.provider_checkout_session_id;
      if(!id)continue;
      const result=await stripeExpire(id);
      if(result.ok){if(result.status==='terminal')terminal++;else expired++;}
      else{failed++;console.error('Stripe session expiration failed',{bookingId:row.booking_id,sessionId:id,error:result.error});}
    }
    return res.status(failed?207:200).json({checked:rows.length,expired,terminal,failed});
  }catch(e){
    console.error('Stale Stripe session cleanup failed',e);
    return res.status(500).json({error:'Unable to expire stale Stripe Checkout Sessions'});
  }
};