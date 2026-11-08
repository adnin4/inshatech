/* Accessible service search/filter. Works with existing service cards once they are
 * moved into #iinsha-service-catalog and annotated with data-category.
 * Existing service DOM and links are retained; this script never deletes records.
 */
(function () {
  'use strict';
  const input = document.getElementById('service-live-search');
  const grid = document.getElementById('iinsha-service-catalog');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('[data-service-card], .service-item-card, .iinsha-service-card'));
  const filters = Array.from(document.querySelectorAll('[data-service-filter]'));
  const count = document.getElementById('service-results-count');
  const empty = document.getElementById('service-empty-state');
  let activeCategory = 'all';

  function normalize(value) {
    return String(value || '').toLocaleLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  function applyFilter() {
    const query = normalize(input ? input.value : '');
    let visible = 0;
    cards.forEach((card) => {
      const category = normalize(card.dataset.category || card.dataset.serviceCategory || 'other');
      const searchable = normalize([card.textContent, card.getAttribute('aria-label'), card.dataset.keywords].join(' '));
      const categoryMatch = activeCategory === 'all' || category === normalize(activeCategory);
      const queryMatch = !query || searchable.includes(query);
      const show = categoryMatch && queryMatch;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (count) count.textContent = `${visible} ${visible === 1 ? 'service' : 'services'}`;
    if (empty) empty.classList.toggle('is-visible', visible === 0);
  }

  filters.forEach((button) => {
    button.addEventListener('click', () => {
      activeCategory = button.dataset.serviceFilter || 'all';
      filters.forEach((other) => {
        const selected = other === button;
        other.setAttribute('aria-pressed', selected ? 'true' : 'false');
      });
      applyFilter();
    });
  });
  if (input) input.addEventListener('input', applyFilter, { passive: true });
  applyFilter();
}());
