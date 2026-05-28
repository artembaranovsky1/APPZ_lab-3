const API_URL = '/api/ads';

export async function fetchAds(searchQuery = '') {
    const url = searchQuery ? `${API_URL}?search=${encodeURIComponent(searchQuery)}` : API_URL;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Помилка завантаження оголошень');
    return await res.json();
}

export async function createAdRequest(newAd) {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAd)
    });
    if (!res.ok) throw new Error('Помилка при створенні оголошення');
    return await res.json();
}

export async function deactivateAdRequest(id, currentUserId) {
    const res = await fetch(`${API_URL}/${id}/deactivate`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentUserId })
    });
    if (!res.ok) throw new Error('Не вдалося деактивувати оголошення');
    return await res.json();
}

export async function deleteAdRequest(id, currentUserId) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentUserId })
    });
    if (!res.ok) throw new Error('Не вдалося видалити оголошення');
    return await res.json();
}