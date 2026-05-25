// ===== DENTRAVO SIGNAL — API ROUTING CONFIG =====
(function() {
    'use strict';

    var isLocalStaticPreview =
        (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') &&
        window.location.port === '4173';

    window.DENTRAVO_SIGNAL_API_BASE = isLocalStaticPreview ? 'http://127.0.0.1:3101' : '';
})();
