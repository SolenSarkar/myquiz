document.addEventListener('DOMContentLoaded',()=>{
  const form = document.getElementById('admin-login-form');
  if(!form) return;
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value;
    // Basic validation
    if(!email || !password){
      alert('Please enter email and password');
      return;
    }

    // Placeholder: call real auth endpoint. Update to your real path.
    try{
      // call admin login endpoint which will set an httpOnly cookie on success
      const res = await fetch('/api/auth/admin-login',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        credentials: 'same-origin',
        body:JSON.stringify({email,password})
      });
      if(res.ok){
        // On successful auth, open the demo admin dashboard in a new tab (absolute path)
        try { sessionStorage.setItem('myquiz_admin_auth', '1') } catch (e) {}
        window.open('/admin-dashboard.html', '_blank', 'noopener,noreferrer')
      } else {
        const data = await res.json().catch(()=>({message:'Login failed'}));
        alert(data.message || 'Login failed');
      }
    }catch(err){
      console.error(err);
      alert('Unable to validate credentials: backend not available')
    }
  });
});
