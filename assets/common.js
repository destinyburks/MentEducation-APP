const SUPABASE_URL='https://zulbqeqmpvivsdwqmyhn.supabase.co';
const SUPABASE_KEY='sb_publishable_UkXuvZaI0lJcZSCFWvgAtw_Mm6d4HVU';
const sb=supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const $=id=>document.getElementById(id);
const money=c=>'$'+((Number(c)||0)/100).toFixed(2);
const fmt=v=>v?new Date(v).toLocaleString([], {dateStyle:'medium',timeStyle:'short'}):'—';
async function requireSession(){
 const {data:{session}}=await sb.auth.getSession();
 if(!session){location.href='/?auth=login&next='+encodeURIComponent(location.pathname);throw new Error('Not signed in');}
 return session;
}
function errorPage(title,msg){
 document.body.innerHTML='<main class="main"><div class="card"><h1>'+title+'</h1><p class="muted">'+msg+'</p></div></main>';
}
