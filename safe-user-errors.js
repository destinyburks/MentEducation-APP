(()=>{
  function looksTechnical(err){
    const m=String(err?.message||err||'');
    return /constraint|violates|relation\s+"|postgres|postgrest|sqlstate|duplicate key|foreign key|check\s+constraint|row-level security|PGRST|2350|2351|2352|2353|2354|42P|new row for relation/i.test(m);
  }
  function friendly(action){
    const map={
      cancellation:"We couldn't process your cancellation. Your booking has not been changed. Please try again or contact MentEducation Support.",
      reschedule:"We couldn't process your reschedule request. Your current booking has not been changed. Please try again or contact MentEducation Support.",
      booking:"We couldn't complete that booking action. Please try again or contact MentEducation Support.",
      payment:"We couldn't complete that payment action. Please try again or contact MentEducation Support."
    };
    return map[action]||map.booking;
  }
  function wrap(obj,name,action){
    if(!obj||typeof obj[name]!=='function'||obj[name].__meSafeWrapped)return;
    const original=obj[name].bind(obj);
    const wrapped=async(...args)=>{
      try{return await original(...args)}
      catch(err){
        console.error(`[MentEducation ${action} error]`,err);
        if(looksTechnical(err))throw new Error(friendly(action));
        throw err;
      }
    };
    wrapped.__meSafeWrapped=true;
    obj[name]=wrapped;
  }
  function apply(){
    if(!window.MEBooking)return;
    wrap(window.MEBooking,'cancelMentee','cancellation');
    wrap(window.MEBooking,'cancel','cancellation');
    wrap(window.MEBooking,'requestReschedule','reschedule');
    wrap(window.MEBooking,'resolveReschedule','reschedule');
    wrap(window.MEBooking,'claimNoShowRebook','booking');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
  setTimeout(apply,0);
  window.MESafeUserErrors={apply,looksTechnical,friendly};
})();