import { fetchAds, createAdRequest, deactivateAdRequest, deleteAdRequest } from './api.js';
import { renderAds, showLoading, showError } from './ui.js';

let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
    const storedUser = localStorage.getItem('board_user');
    if (!storedUser) {
        window.location.href = '/login.html';
        return;
    }
    currentUser = JSON.parse(storedUser);
    document.getElementById('currentUserDisplay').textContent = currentUser.username;

    loadAdsData();
});

window.logout = () => {
    localStorage.removeItem('board_user');
    window.location.href = '/login.html';
};

window.executeSearch = () => {
    const query = document.getElementById('searchInput').value.trim();
    loadAdsData(query);
};

window.handleDeactivate = async (id) => {
    if (!confirm('Бажаєте деактивувати це оголошення?')) return;
    try {
        await deactivateAdRequest(id, currentUser.id);
        loadAdsData(document.getElementById('searchInput').value.trim());
    } catch (error) {
        alert(error.message);
    }
};

window.handleDelete = async (id) => {
    if (!confirm('Видалити це оголошення? Дія незворотна.')) return;
    try {
        await deleteAdRequest(id, currentUser.id);
        loadAdsData(document.getElementById('searchInput').value.trim());
    } catch (error) {
        alert(error.message);
    }
};

window.handleBuy = (title) => {
    alert(`Вітаємо! Ви успішно "купили" товар: "${title}".`);
};


async function loadAdsData(searchQuery = '') {
    showLoading();
    if (!searchQuery) document.getElementById('searchInput').value = '';

    try {
        const ads = await fetchAds(searchQuery);
        ads.reverse();
        renderAds(ads, currentUser);
    } catch (error) {
        console.error(error);
        showError('Помилка завантаження оголошень. Перевірте підключення до сервера.');
    }
}

document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') window.executeSearch();
});

document.getElementById('createAdForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    const tagInput = document.getElementById('tagNames').value;
    const tagNames = tagInput ? tagInput.split(',').map(t => t.trim()).filter(t => t) : [];

    const newAd = {
        title: document.getElementById('title').value,
        content: document.getElementById('content').value,
        price: parseFloat(document.getElementById('price').value),
        authorId: currentUser.id,
        categoryName: document.getElementById('categoryName').value,
        tagNames: tagNames
    };

    try {
        await createAdRequest(newAd);

        document.getElementById('createAdForm').reset();
        const modalElement = document.getElementById('createAdModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();

        await loadAdsData();
    } catch (error) {
        alert(error.message);
    } finally {
        submitBtn.disabled = false;
    }
});