// ===== DENTRAVO SIGNAL — OUTBOUND EVENT TRACKING =====
(function() {
    'use strict';

    document.addEventListener('click', function(event) {
        var link = event.target.closest('a[data-signal-event]');
        if (!link) return;

        var payload = {
            eventType: link.getAttribute('data-signal-event'),
            productSlug: link.getAttribute('data-signal-product'),
            targetUrl: link.href
        };

        if (!payload.eventType || !payload.productSlug || !window.fetch) return;

        var apiBase = window.DENTRAVO_SIGNAL_API_BASE || '';

        fetch(apiBase + '/api/signal/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            keepalive: true
        }).catch(function() {
            return null;
        });
    });
})();
