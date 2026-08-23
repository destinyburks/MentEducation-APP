const SUPABASE_URL='https://zulbqeqmpvivsdwqmyhn.supabase.co';
module.exports=async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  try{
    const token=(req.headers.authorization||'').replace(/^Bearer\s+/i,'');
    if(!token) return res.status(401).json({error:'Sign in required'});
    const bookingId=req.body&&req.body.booking_id;
    if(!bookingId) return res.status(400).json({error:'Booking is required'});
    if(!process.env.STRIPE_SECRET_KEY||!process.env.SUPABASE_SERVICE_ROLE_KEY) return res.status(503).json({error:'Secure Stripe checkout is not activated on this deployment yet.'});
    const summaryRes=await fetch(SUPABASE_URL+'/rest/v1/rpc/get_booking_checkout_summary',{method:'POST',headers:{'apikey':process.env.SUPABASE_ANON_KEY||'sb_publishable_UkXuvZaI0lJcZSCFWvgAtw_Mm6d4HVU','Authorization':'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({p_booking_id:bookingId})});
    const summary=await summaryRes.json();
    if(!summaryRes.ok) return res.status(summaryRes.status).json({error:summary.message||'Unable to verify booking'});
    if(summary.status!=='pending'||!summary.hold_expires_at||new Date(summary.hold_expires_at)<=new Date()) return res.status(409).json({error:'This appointment hold has expired.'});
    if(Number(summary.cash_due_cents)<=0) return res.status(400).json({error:'No cash payment is required for this booking.'});
    const origin='https://'+req.headers.host;
    const form=new URLSearchParams();
    form.set('mode','payment');
    form.set('success_url',origin+'/booking-status.html?booking='+encodeURIComponent(bookingId)+'&checkout=success');
    form.set('cancel_url',origin+'/checkout.html?booking='+encodeURIComponent(bookingId));
    form.set('client_reference_id',bookingId);
    form.set('metadata[booking_id]',bookingId);
    form.set('payment_intent_data[metadata][booking_id]',bookingId);
    form.set('line_items[0][price_data][currency]','usd');
    form.set('line_items[0][price_data][unit_amount]',String(summary.cash_due_cents));
    form.set('line_items[0][price_data][product_data][name]','MentEducation mentorship session');
    form.set('line_items[0][quantity]','1');
    const stripeRes=await fetch('https://api.stripe.com/v1/checkout/sessions',{method:'POST',headers:{'Authorization':'Bearer '+process.env.STRIPE_SECRET_KEY,'Content-Type':'application/x-www-form-urlencoded'},body:form});
    const stripe=await stripeRes.json();
    if(!stripeRes.ok){
      console.error('Stripe checkout session creation failed',{
        status:stripeRes.status,
        type:stripe.error&&stripe.error.type,
        code:stripe.error&&stripe.error.code,
        param:stripe.error&&stripe.error.param,
        message:stripe.error&&stripe.error.message
      });
      return res.status(502).json({
        error:stripe.error&&stripe.error.message||'Stripe Checkout could not be created',
        stripe_code:stripe.error&&stripe.error.code||null,
        stripe_param:stripe.error&&stripe.error.param||null
      });
    }
    const attachRes=await fetch(SUPABASE_URL+'/rest/v1/rpc/attach_stripe_checkout_session',{method:'POST',headers:{'apikey':process.env.SUPABASE_SERVICE_ROLE_KEY,'Authorization':'Bearer '+process.env.SUPABASE_SERVICE_ROLE_KEY,'Content-Type':'application/json'},body:JSON.stringify({p_booking_id:bookingId,p_checkout_session_id:stripe.id})});
    if(!attachRes.ok) return res.status(409).json({error:'The appointment hold expired before checkout opened.'});
    return res.status(200).json({url:stripe.url,session_id:stripe.id});
  }catch(e){
    console.error('Checkout endpoint failure',e);
    return res.status(500).json({error:e.message||'Unable to create checkout'});
  }
};