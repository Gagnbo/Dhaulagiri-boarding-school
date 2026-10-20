/* PWA installation and optional OneSignal web push setup. */
(function () {
  'use strict';

  let installPrompt = null;
  const appId = ''; // Set to the public OneSignal App ID after configuring the web platform.

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(error => {
        console.error('Service worker registration failed:', error);
      });
    });
  }

  const actions = document.querySelector('.nav-actions');
  if (actions) {
    const installButton = document.createElement('button');
    installButton.type = 'button';
    installButton.className = 'small-btn pwa-action';
    installButton.id = 'installApp';
    installButton.textContent = 'Install App';
    installButton.hidden = true;
    actions.prepend(installButton);

    installButton.addEventListener('click', async () => {
      if (!installPrompt) return;
      installPrompt.prompt();
      await installPrompt.userChoice;
      installPrompt = null;
      installButton.hidden = true;
    });

    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault();
      installPrompt = event;
      installButton.hidden = false;
    });
    window.addEventListener('appinstalled', () => {
      installPrompt = null;
      installButton.hidden = true;
    });
  }

  // Notification permission must follow a user click; browsers suppress unsolicited prompts.
  if (appId) {
    const sdk = document.createElement('script');
    sdk.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
    sdk.defer = true;
    document.head.appendChild(sdk);

    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async OneSignal => {
      await OneSignal.init({
        appId,
        serviceWorkerPath: './sw.js',
        serviceWorkerParam: { scope: './' }
      });

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'small-btn pwa-action';
      button.id = 'enableNotifications';
      button.textContent = 'Enable Alerts';
      button.addEventListener('click', () => OneSignal.Notifications.requestPermission());
      if (actions) actions.prepend(button);
    });
  }
})();
