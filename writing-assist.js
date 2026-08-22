(()=>{
  const SKIP_TYPES=new Set(['email','password','number','date','datetime-local','time','url','tel','file','search']);
  const COMMON=[
    [/\bim\b/gi,"I'm"],[/\bive\b/gi,"I've"],[/\bid\b/gi,"I'd"],[/\bill\b/gi,"I'll"],
    [/\bdont\b/gi,"don't"],[/\bcant\b/gi,"can't"],[/\bwont\b/gi,"won't"],[/\bdidnt\b/gi,"didn't"],
    [/\bdoesnt\b/gi,"doesn't"],[/\bisnt\b/gi,"isn't"],[/\barent\b/gi,"aren't"],[/\bwasnt\b/gi,"wasn't"],
    [/\bwerent\b/gi,"weren't"],[/\bshouldnt\b/gi,"shouldn't"],[/\bcouldnt\b/gi,"couldn't"],[/\bwouldnt\b/gi,"wouldn't"],
    [/\bthats\b/gi,"that's"],[/\btheres\b/gi,"there's"],[/\byoure\b/gi,"you're"],[/\btheyre\b/gi,"they're"],
    [/\bhes\b/gi,"he's"],[/\bshes\b/gi,"she's"],[/\bwhats\b/gi,"what's"],[/\blets\b/gi,"let's"]
  ];
  function shouldAssist(el){
    if(!el||el.dataset.noWritingAssist==='true'||el.disabled||el.readOnly)return false;
    if(el.tagName==='TEXTAREA')return true;
    if(el.tagName==='INPUT'){
      const type=(el.type||'text').toLowerCase();
      if(SKIP_TYPES.has(type))return false;
      const n=((el.name||'')+' '+(el.id||'')+' '+(el.placeholder||'')).toLowerCase();
      if(/name|title|company|city|state|zip|price|rate|skill|category|search/.test(n))return false;
      return type==='text';
    }
    return false;
  }
  function polish(raw){
    if(!raw)return raw;
    let text=raw.replace(/[\t ]+/g,' ').replace(/ +\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim();
    text=text.replace(/\s+([,.;!?])/g,'$1').replace(/([,.;!?])([^\s\n"'’”)\]])/g,'$1 $2');
    text=text.replace(/\bi\b/g,'I');
    COMMON.forEach(([r,v])=>{text=text.replace(r,v)});
    text=text.replace(/(^|[.!?]\s+|\n+)([a-z])/g,(m,p,c)=>p+c.toUpperCase());
    text=text.replace(/([!?.,])\1{1,}/g,'$1');
    if(text.length>12 && !/[.!?…]$/.test(text) && /\s/.test(text) && !/https?:\/\/\S+$/.test(text)) text+='.';
    return text;
  }
  function apply(el){
    if(!shouldAssist(el)||el.dataset.writingAssistBound==='true')return;
    el.spellcheck=true;
    el.setAttribute('autocapitalize','sentences');
    el.setAttribute('autocorrect','on');
    el.dataset.writingAssist='on';
    el.dataset.writingAssistBound='true';
    const clean=()=>{
      const before=el.value;
      const after=polish(before);
      if(after!==before){
        el.value=after;
        el.dispatchEvent(new Event('input',{bubbles:true}));
      }
    };
    el.addEventListener('blur',clean);
    el.addEventListener('change',clean);
  }
  function scan(root=document){
    if(root.matches?.('textarea,input'))apply(root);
    root.querySelectorAll?.('textarea,input').forEach(apply);
  }
  function init(){
    scan();
    if(!document.body)return;
    new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1)scan(n)}))).observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
  document.addEventListener('submit',e=>e.target.querySelectorAll?.('textarea,input').forEach(el=>{if(shouldAssist(el)){const v=polish(el.value);if(v!==el.value)el.value=v}}),true);
  window.MEWritingAssist={polish,scan};
})();