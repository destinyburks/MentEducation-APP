const SUPABASE_URL='https://zulbqeqmpvivsdwqmyhn.supabase.co';

async function stripeGet(path){
  const r=await fetch('https://api.stripe.com'+path,{headers:{Authorization:'Bearer '+process.env.STRIPE_SECRET_KEY}});
  const data=await r.json();
  if(!r.ok) throw new Error((data.error&&data.error.message)||'Stripe request failed');
  return data;
}
async function stripePost(path,params){
  const body=new URLSearchParams();
  Object.entries(params||{}).forEach(([k,v])=>{if(v!==undefined&&v!==null&&v!=='')body.set(k,String(v));});
  const r=await fetch('https://api.stripe.com'+path,{method:'POST',headers:{Authorization:'Bearer '+process.env.STRIPE_SECRET_KEY,'Content-Type':'application/x-www-form-urlencoded'},body});
  const data=await r.json();
  if(!r.ok) throw new Error((data.error&&data.error.message)||'Stripe request failed');
  return data;
}

module.exports=async function handler(req,res){
  if(req.method!=='GET'&&req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  if(!process.env.CRON_SECRET||!process.env.STRIPE_SECRET_KEY||!process.env.SUPABASE_SERVICE_ROLE_KEY) return res.status(503).json({error:'Payout processor is not fully configured.'});
  if(req.headers.authorization!==`Bearer ${process.env.CRON_SECRET}`) return res.status(401).json({error:'Unauthorized'});

  const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  const headers={apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json'};
  const stats={released:0,processed:0,skipped:0,failed:0};
  try{
    const release=await fetch(SUPABASE_URL+'/rest/v1/rpc/release_due_mentor_payouts',{method:'POST',headers,body:'{}'});
    if(!release.ok) throw new Error('Unable to release due payout holds');
    stats.released=Number(await release.json())||0;

    const dueRes=await fetch(SUPABASE_URL+'/rest/v1/mentor_payouts?status=eq.pending&select=id,mentor_id,payment_id,amount_cents,currency,source_booking_id&order=created_at.asc&limit=50',{headers});
    const due=await dueRes.json();
    if(!dueRes.ok) throw new Error(due.message||'Unable to load due payouts');

    for(const payout of due){
      try{
        const claimRes=await fetch(`${SUPABASE_URL}/rest/v1/mentor_payouts?id=eq.${encodeURIComponent(payout.id)}&status=eq.pending`,{method:'PATCH',headers:{...headers,Prefer:'return=representation'},body:JSON.stringify({status:'in_transit',updated_at:new Date().toISOString()})});
        const claimed=await claimRes.json();
        if(!claimRes.ok||!Array.isArray(claimed)||!claimed.length){stats.skipped++;continue;}

        const acctRes=await fetch(`${SUPABASE_URL}/rest/v1/mentor_payout_accounts?mentor_id=eq.${encodeURIComponent(payout.mentor_id)}&select=provider_account_id,payouts_enabled&limit=1`,{headers});
        const accts=await acctRes.json();
        const acct=Array.isArray(accts)?accts[0]:null;
        if(!acct||!acct.provider_account_id||!acct.payouts_enabled){
          await fetch(`${SUPABASE_URL}/rest/v1/mentor_payouts?id=eq.${encodeURIComponent(payout.id)}`,{method:'PATCH',headers,body:JSON.stringify({status:'pending',hold_reason:'stripe_connect_setup_required',updated_at:new Date().toISOString()})});
          stats.skipped++;continue;
        }

        const payRes=await fetch(`${SUPABASE_URL}/rest/v1/payments?id=eq.${encodeURIComponent(payout.payment_id)}&select=provider_payment_intent_id,provider_transfer_id&limit=1`,{headers});
        const pays=await payRes.json();
        const payment=Array.isArray(pays)?pays[0]:null;
        if(!payment||!payment.provider_payment_intent_id) throw new Error('Payment intent is missing');
        if(payment.provider_transfer_id){
          await fetch(`${SUPABASE_URL}/rest/v1/mentor_payouts?id=eq.${encodeURIComponent(payout.id)}`,{method:'PATCH',headers,body:JSON.stringify({status:'paid',provider_payout_id:payment.provider_transfer_id,paid_at:new Date().toISOString(),updated_at:new Date().toISOString()})});
          stats.processed++;continue;
        }

        const intent=await stripeGet('/v1/payment_intents/'+encodeURIComponent(payment.provider_payment_intent_id));
        const chargeId=typeof intent.latest_charge==='string'?intent.latest_charge:(intent.latest_charge&&intent.latest_charge.id)||'';
        const transfer=await stripePost('/v1/transfers',{
          amount:payout.amount_cents,
          currency:payout.currency||'usd',
          destination:acct.provider_account_id,
          source_transaction:chargeId,
          transfer_group:'booking_'+String(payout.source_booking_id||payout.payment_id).replace(/[^a-zA-Z0-9_-]/g,''),
          'metadata[menteducation_payout_id]':payout.id,
          'metadata[booking_id]':payout.source_booking_id||''
        });
        const now=new Date().toISOString();
        await fetch(`${SUPABASE_URL}/rest/v1/mentor_payouts?id=eq.${encodeURIComponent(payout.id)}`,{method:'PATCH',headers,body:JSON.stringify({status:'paid',provider_payout_id:transfer.id,paid_at:now,updated_at:now,hold_reason:null})});
        await fetch(`${SUPABASE_URL}/rest/v1/payments?id=eq.${encodeURIComponent(payout.payment_id)}`,{method:'PATCH',headers,body:JSON.stringify({provider_transfer_id:transfer.id,updated_at:now})});
        stats.processed++;
      }catch(err){
        stats.failed++;
        await fetch(`${SUPABASE_URL}/rest/v1/mentor_payouts?id=eq.${encodeURIComponent(payout.id)}`,{method:'PATCH',headers,body:JSON.stringify({status:'pending',hold_reason:'stripe_transfer_retry_required',updated_at:new Date().toISOString()})});
        console.error('Payout failed',payout.id,err.message);
      }
    }
    return res.status(200).json(stats);
  }catch(e){
    return res.status(500).json({error:e.message||'Unable to process payouts',...stats});
  }
};