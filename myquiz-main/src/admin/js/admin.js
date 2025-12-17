document.addEventListener('DOMContentLoaded',()=>{
  const actionBtn = document.getElementById('admin-action');

  // Query session status and toggle button
  async function refreshButton(){
    if(!actionBtn) return;
    actionBtn.textContent = 'Checking...';
    try{
      const res = await fetch('/api/auth/me', { credentials: 'same-origin' });
      if(res.ok){
        actionBtn.textContent = 'Logout';
        actionBtn.onclick = async () => {
          try{
            const r = await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
            if(r.ok){
              window.location.href = '/';
            } else {
              alert('Logout failed');
            }
          }catch(e){
            console.error(e);
            alert('Network error during logout');
          }
        };
      } else {
        actionBtn.textContent = 'Admin Login';
        actionBtn.onclick = () => { window.location.href = '/'; };
      }
    }catch(err){
      console.error(err);
      actionBtn.textContent = 'Admin Login';
      actionBtn.onclick = () => { window.location.href = '/'; };
    }
  }

  refreshButton();
});
