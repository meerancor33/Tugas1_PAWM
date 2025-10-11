;(() => {
  function renderNav() {
    const slot = document.getElementById("auth-slot");
    if (!slot) return;

    if (!window.Auth) {
      console.error('Auth module tidak ditemukan');
      return;
    }

    if (window.Auth.isLoggedIn()) {
      const user = window.Auth.getUser();
      const userEmail = user?.email || 'User';
      
      slot.innerHTML = `
        <a href="profile.html" class="nav-link" title="${userEmail}">Profil</a>
      `;
      
      // Add logout button as a standalone element
      const logoutBtn = document.createElement('button');
      logoutBtn.id = 'logoutBtn';
      logoutBtn.className = 'btn btn-secondary';
      logoutBtn.textContent = 'Keluar';
      logoutBtn.style.marginLeft = '0.5rem';
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Apakah Anda yakin ingin keluar?')) {
          window.Auth.logout();
        }
      });

      // Append logout button after auth-slot
      const navMenu = document.querySelector('.nav-menu');
      if (navMenu && !document.getElementById('logoutBtn')) {
        navMenu.appendChild(logoutBtn);
      }
    } else {
      slot.innerHTML = `<a href="login.html" class="nav-link">Masuk</a>`;
      // Remove logout button if it exists when not logged in
      const existingLogout = document.getElementById('logoutBtn');
      if (existingLogout) {
        existingLogout.remove();
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", renderNav);
  } else {
    renderNav();
  }

  window.addEventListener('authStateChanged', renderNav);
})();