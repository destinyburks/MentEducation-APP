const SUPABASE_URL='https://zulbqeqmpvivsdwqmyhn.supabase.co';
const ANON_KEY=process.env.SUPABASE_ANON_KEY||'sb_publishable_UkXuvZaI0lJcZSCFWvgAtw_Mm6d4HVU';

async function stripePost(path,params){
  const body=new URLSearchParams();
  Object.entries(params||{}).forEach(([k,v])=>{if(v!==undefined&&v!==null&&v!=='')body.set(k,String(v));});
  const r=await fetch('https://api.stripe.com'+path,{method:'POST',headers:{Authorization:'Bearer '+process.env.STRIPE_SECRET_KEY,'Content-Type':'application/x-www-form-urlencoded'},body});
  const data=await r.json();
  if(!r.ok) throw new Error((data.error&&data.error.message)||'Stripe request failed');
  return data;
}

async function getUser(token){
  const r=await fetch(SUPABASE_URL+'/auth/v1/user',{headers:{apikey:ANON_KEY,Authorization:'Bearer '+token}});
  if(!r.ok) return null;
  return r.json();
}

module.exports=async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  if(!process.env.STRIPE_SECRET_KEY||!process.env.SUPABASE_SERVICE_ROLE_KEY) return res.status(503).json({error:'Stripe Connect is not configured on this deployment yet.'});
  try{
    const token=(req.headers.authorization||'').replace(/^Bearer\s+/i,'');
    if(!token) return res.status(401).json({error:'Sign in required'});
    const user=await getUser(token);
    if(!user||!user.id) return res.status(401).json({error:'Your session has expired. Please sign in again.'});

    const serviceHeaders={apikey:process.env.SUPABASE_SERVICE_ROLE_KEY,Authorization:'Bearer '+process.env.SUPABASE_SERVICE_ROLE_KEY,'Content-Type':'application/json'};
    const mentorRes=await fetch(`${SUPABASE_URL}/rest/v1/mentor_profiles?user_id=eq.${encodeURIComponent(user.id)}&select=user_id&limit=1`,{headers:serviceHeaders});
    const mentors=await mentorRes.json();
    if(!mentorRes.ok||!Array.isArray(mentors)||!mentors.length) return res.status(403).json({error:'A mentor profile is required before setting up payouts.'});

    const acctRes=await fetch(`${SUPABASE_URL}/rest/v1/mentor_payout_accounts?mentor_id=eq.${encodeURIComponent(user.id)}&select=*&limit=1`,{headers:serviceHeaders});
    const rows=await acctRes.json();
    if(!acctRes.ok) throw new Error(rows.message||'Unable to load payout account');
    let accountId=rows[0]&&rows[0].provider_account_id;

    if(!accountId){
      const account=await stripePost('/v1/accounts',{
        type:'express',
        country:'US',
        email:user.email||'',
        'capabilities[transfers][requested]':'true',
        'business_profile[product_description]':'Mentorship services through MentEducation',
        'metadata[menteducation_mentor_id]':user.id
      });
      accountId=account.id;
      const upsert=await fetch(SUPABASE_URL+'/rest/v1/mentor_payout_accounts',{method:'POST',headers:{...serviceHeaders,Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({mentor_id:user.id,provider:'stripe',provider_account_id:accountId,onboarding_status:'started',charges_enabled:!!account.charges_enabled,payouts_enabled:!!account.payouts_enabled,details_submitted:!!account.details_submitted,updated_at:new Date().toISOString()})});
      if(!upsert.ok) throw new Error('Unable to save mentor payout account');
    }

    const origin='https://'+req.headers.host;
    const link=await stripePost('/v1/account_links',{
      account:accountId,
      refresh_url:origin+'/earnings/?connect=refresh',
      return_url:origin+'/earnings/?connect=return',
      type:'account_onboarding'
    });
    return res.status(200).json({url:link.url});
  }catch(e){
    return res.status(500).json({error:e.message||'Unable to start Stripe Connect onboarding'});
  }
};