document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem('board_user')) {
        window.location.href = '/index.html';
    }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('usernameInput').value.trim();
    const btn = document.getElementById('loginBtn');

    if (username) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Вхід...';
        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });

            if(res.ok) {
                const user = await res.json();
                localStorage.setItem('board_user', JSON.stringify(user));
                window.location.href = '/index.html';
            }
        } catch (err) {
            alert("Помилка з'єднання з сервером");
        } finally {
            btn.disabled = false;
            btn.innerHTML = 'Увійти <i class="bi bi-box-arrow-in-right"></i>';
        }
    }
});