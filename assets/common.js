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
function errorPage(title,msg){document.body.innerHTML='<main class="main"><div class="card"><h1>'+title+'</h1><p class="muted">'+msg+'</p></div></main>'}
async function mountNotificationBell(target){
 const host=typeof target==='string'?document.querySelector(target):target;if(!host)return;
 if(!document.getElementById('meBellStyle')){const st=document.createElement('style');st.id='meBellStyle';st.textContent='.meBell{position:relative;display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border:1px solid #dedbea;border-radius:13px;background:#fff;text-decoration:none;font-size:20px}.meBellBadge{position:absolute;right:-5px;top:-7px;min-width:20px;height:20px;padding:0 5px;border-radius:999px;background:#6d3df5;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center}.meBellBadge.zero{display:none}';document.head.appendChild(st)}
 const a=document.createElement('a');a.className='meBell';a.href='/notifications.html';a.setAttribute('aria-label','Notifications');a.innerHTML='🔔<span class="meBellBadge zero">0</span>';host.appendChild(a);
 try{const {data:{session}}=await sb.auth.getSession();if(!session)return;const {data,error}=await sb.rpc('get_my_notifications',{p_limit:1});if(error)return;const n=Number(data?.unread_count||0),badge=a.querySelector('.meBellBadge');badge.textContent=n>99?'99+':n;badge.classList.toggle('zero',n===0);a.title=n?`${n} unread notification${n===1?'':'s'}`:'No unread notifications'}catch(e){}
}
window.mountNotificationBell=mountNotificationBell;
document.addEventListener('click',e=>{
 const messageTarget=e.target.closest('[onclick*="openView(\'messages\')"]');
 if(messageTarget){e.preventDefault();e.stopImmediatePropagation();location.href='/messages.html';return}
 const sessionTarget=e.target.closest('[onclick*="openView(\'sessions\')"]');
 if(!sessionTarget)return;
 const roleBtn=document.querySelector('.rolepicker button.active');
 const currentRole=roleBtn?.dataset?.role||new URLSearchParams(location.search).get('role')||'mentee';
 if(currentRole==='owner')return;
 e.preventDefault();e.stopImmediatePropagation();location.href='/sessions.html?role='+encodeURIComponent(currentRole);
},true);
