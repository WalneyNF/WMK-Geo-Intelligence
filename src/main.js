import { createStandaloneApplication } from './standalone/application.js';
import { describeError } from './standalone/errors.js';
import { t } from './i18n/index.js';
import { mountGpsLayer } from './wmk/gps/gpsLayer.js';
import { mountWmkResearch } from './wmk/research/researchPanel.js';

const application = createStandaloneApplication({
  googleApiKey: import.meta.env.GOOGLE_MAPS_API_KEY,
  cesiumToken: import.meta.env.CESIUM_ION_TOKEN,
  allowQaRegistration: import.meta.env.DEV,
});

application.start().then(({scene}) => {
  const gps = mountGpsLayer(scene.viewer);
  const destroyResearch = mountWmkResearch(scene.viewer);
  window.addEventListener('pagehide', destroyResearch, { once: true });
  window.addEventListener('pagehide', () => gps.destroy(), { once: true });
}).catch((error) => {
  console.error("God's Eye View initialization failed:", error);
  const loaderStatus = document.querySelector('#loading-screen .loader-status');
  loaderStatus.textContent = t('Error: {message}', {
    message: describeError(error),
  });
  loaderStatus.style.color = '#ff4444';
});

export { application };
