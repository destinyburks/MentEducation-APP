const crypto=require('crypto');
const SUPABASE_URL='https://zulbqeqmpvivsdwqmyhn.supabase.co';
function readRaw(req){return new Promise((resolve,reject)=>{const chunks=[];req.on('data',c=>chunks.push(Buffer.from(c)));req.on('end',()=>resolve(Buffer.concat(chunks)));req.on('error',reject)})}
function validSig(raw,header,secret){if(!header||!secret)return false;const parts=Object.fromEntries(header.split(',').map(x=>x.split('=')));const t=parts.t,v1=parts.v1;if(!t||!v1)return false;if(Math.abs(Date.now()/1000-Number(t))>300)return false;const expected=crypto.createHmac('sha256',secret).update(t+'.'+raw.toString('utf8')).digest('hex');try{return crypto.timingSafeEqual(Buffer.from(expected),Buffer.from(v1))}catch{return false}}
async function stripeRefund(paymentIntent,reason){const form=new URLSearchParams();form.set('payment_intent',paymentIntent);if(reason)form.set('metadata[reason]',reason);return fetch('https://api.stripe.com/v1/refunds',{method:'POST',headers:{'Authorization':'Bearer '+process.env.STRIPE_SECRET_KEY,'Content-Type':'application/x-www-form-urlencoded'},body:form})}
module.exports=async function handler(req,res){
  if(req.method!=='POST') return res.status(405).send('Method not allowed');
  if(!process.env.STRIPE_WEBHOOK_SECRET||!process.env.STRIPE_SECRET_KEY||!process.env.SUPABASE_SERVICE_ROLE_KEY) return res.status(503).send('Webhook not configured');
  try{
    const raw=await readRaw(req);
    if(!validSig(raw,req.headers['stripe-signature'],process.env.STRIPE_WEBHOOK_SECRET)) return res.status(400).send('Invalid signature');
    const event=JSON.parse(raw.toString('utf8'));
    if(event.type==='checkout.session.completed'&&event.data&&event.data.object){
      const s=event.data.object,bookingId=(s.metadata&&s.metadata.booking_id)||s.client_reference_id;
      if(bookingId&&s.payment_status==='paid'){
        const cash=Number(s.amount_total||0);
        const rpc=await fetch(SUPABASE_URL+'/rest/v1/rpc/mark_booking_payment_succeeded',{method:'POST',headers:{'apikey':process.env.SUPABASE_SERVICE_ROLE_KEY,'Authorization':'Bearer '+process.env.SUPABASE_SERVICE_ROLE_KEY,'Content-Type':'application/json'},body:JSON.stringify({p_booking_id:bookingId,p_checkout_session_id:s.id,p_payment_intent_id:s.payment_intent||'',p_cash_collected_cents:cash})});
        if(!rpc.ok&&s.payment_intent){await stripeRefund(s.payment_intent,'booking_hold_expired_or_invalid');}
      }
    }
    return res.status(200).json({received:true});
  }catch(e){return res.status(500).send(e.message||'Webhook error')}
};