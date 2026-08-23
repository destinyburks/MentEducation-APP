const SUPABASE_URL='https://zulbqeqmpvivsdwqmyhn.supabase.co';
const ANON_KEY=process.env.SUPABASE_ANON_KEY||'sb_publishable_UkXuvZaI0lJcZSCFWvgAtw_Mm6d4HVU';

async function getUser(token){const r=await fetch(SUPABASE_URL+'/auth/v1/user',{headers:{apikey:ANON_KEY,Authorization:'Bearer '+token}});return r.ok?r.json():null;}
async function stripeGet(path){const r=await fetch('https://api.stripe.com'+path,{headers:{Authorization:'Bearer '+process.env.STRIPE_SECRET_KEY}});const d=await r.json();if(!r.ok)throw new Error((d.error&&d.error.message)||'Stripe request failed');return d;}

module.exports=async function handler(req,res){
  if(req.method!=='GET'&&req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  if(!process.env.STRIPE_SECRET_KEY||!process.env.SUPABASE_SERVICE_ROLE_KEY) return res.status(503).json({error:'Stripe Connect is not configured.'});
  try{
    const token=(req.headers.authorization||'').replace(/^Bearer\s+/i,'');
    const user=token&&await getUser(token);
    if(!user||!user.id) return res.status(401).json({error:'Sign in required'});
    const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
    const headers={apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json'};
    const r=await fetch(`${SUPABASE_URL}/rest/v1/mentor_payout_accounts?mentor_id=eq.${encodeURIComponent(user.id)}&select=*&limit=1`,{headers});
    const rows=await r.json();
    if(!r.ok) throw new Error(rows.message||'Unable to load payout account');
    const row=rows[0];
    if(!row||!row.provider_account_id) return res.status(200).json({onboarding_status:'not_started',charges_enabled:false,payouts_enabled:false,details_submitted:false});
    const account=await stripeGet('/v1/accounts/'+encodeURIComponent(row.provider_account_id));
    const status=account.details_submitted?(account.payouts_enabled?'complete':'pending_review'):'started';
    const now=new Date().toISOString();
    await fetch(`${SUPABASE_URL}/rest/v1/mentor_payout_accounts?mentor_id=eq.${encodeURIComponent(user.id)}`,{method:'PATCH',headers,body:JSON.stringify({onboarding_status:status,charges_enabled:!!account.charges_enabled,payouts_enabled:!!account.payouts_enabled,details_submitted:!!account.details_submitted,updated_at:now})});
    return res.status(200).json({onboarding_status:status,charges_enabled:!!account.charges_enabled,payouts_enabled:!!account.payouts_enabled,details_submitted:!!account.details_submitted});
  }catch(e){return res.status(500).json({error:e.message||'Unable to sync Stripe Connect status'});}
};