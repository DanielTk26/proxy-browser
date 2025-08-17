(function(){
  const input = document.getElementById('address');
  const btn = document.getElementById('go');
  const frame = document.getElementById('frame');

  function normalize(u){
    if(!u) return null;
    u = u.trim();
    if(!/^https?:\/\//i.test(u)){
      u = 'https://' + u;
    }
    try{ new URL(u); return u; }catch(e){ return null; }
  }

  function navigate(){
    const u = normalize(input.value);
    if(!u){ alert('Enter a valid URL (include https://)'); return; }
    frame.src = '/proxy/' + u;
  }

  btn.addEventListener('click', navigate);
  input.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter') navigate();
  });

  input.value = 'https://example.com';
  navigate();
})();
