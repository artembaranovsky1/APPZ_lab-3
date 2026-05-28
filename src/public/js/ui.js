export function showLoading() {
    const container = document.getElementById('adsList');
    container.innerHTML = '<div class="text-center my-5"><div class="spinner-border text-primary"></div></div>';
}

export function showError(message) {
    const container = document.getElementById('adsList');
    container.innerHTML = `<div class="alert alert-danger">${message}</div>`;
}

export function renderAds(ads, currentUser) {
    const container = document.getElementById('adsList');
    container.innerHTML = '';

    if (ads.length === 0) {
        container.innerHTML = `<div class="col-12 text-center my-5">
            <i class="bi bi-search text-muted" style="font-size: 3rem;"></i>
            <h5 class="text-muted mt-3">Нічого не знайдено</h5>
        </div>`;
        return;
    }

    ads.forEach(ad => {
        const tagsBadge = ad.tags && ad.tags.length > 0
            ? ad.tags.map(t => `<span class="badge bg-light text-dark border me-1"><i class="bi bi-tag-fill text-secondary me-1"></i>${t}</span>`).join('')
            : '<span class="text-muted small">без тегів</span>';

        const isItemActive = ad.status === 'Активне';
        const statusClass = isItemActive ? 'bg-success' : 'bg-danger';
        const isOwner = ad.author === currentUser.username;
        let actionButtons = '';

        if (isOwner) {
            const deactivateBtn = isItemActive
                ? `<button class="btn btn-sm btn-outline-warning me-2" onclick="window.handleDeactivate(${ad.id})"><i class="bi bi-eye-slash"></i> Деактивувати</button>`
                : '';
            actionButtons = `
                <div class="d-flex">
                    ${deactivateBtn}
                    <button class="btn btn-sm btn-outline-danger" onclick="window.handleDelete(${ad.id})"><i class="bi bi-trash3"></i> Видалити</button>
                </div>
            `;
        } else {
            actionButtons = isItemActive
                ? `<button class="btn btn-sm btn-primary px-3" onclick="window.handleBuy('${ad.title}')"><i class="bi bi-cart-plus me-1"></i> Купити</button>`
                : `<button class="btn btn-sm btn-secondary px-3" disabled><i class="bi bi-dash-circle me-1"></i> Недоступно</button>`;
        }

        const cardHtml = `
            <div class="col-md-6 col-lg-4">
                <div class="card shadow-sm ad-card h-100 border-top border-4 ${isItemActive ? 'border-success' : 'border-danger'}">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title fw-bold mb-0 text-dark">${ad.title}</h5>
                            <span class="badge bg-success price-badge">${ad.priceFormatted}</span>
                        </div>
                        <div class="mb-3 d-flex gap-1 align-items-center flex-wrap">
                            <span class="badge bg-primary bg-opacity-10 text-primary">${ad.category}</span>
                            <span class="badge ${statusClass} text-white"><i class="bi bi-circle-fill me-1" style="font-size: 0.6rem;"></i> ${ad.status}</span>
                        </div>
                        <p class="card-text text-secondary bg-light p-2 rounded flex-grow-1">${ad.description}</p>
                        <div class="mb-3">${tagsBadge}</div>
                        <hr class="text-muted opacity-25 mt-auto">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="text-muted small">
                                <i class="bi bi-person-circle me-1"></i> Автор: <strong>${ad.author}</strong>
                            </div>
                            ${actionButtons}
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += cardHtml;
    });
}