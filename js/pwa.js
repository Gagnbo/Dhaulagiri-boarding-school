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
    installButton.hidden = (window.matchMedia &&
      window.matchMedia('(display-mode: standalone)').matches) ||
      navigator.standalone === true;
    actions.prepend(installButton);

    installButton.addEventListener('click', async () => {
      if (!installPrompt) {
        const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
          (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        window.alert(isIOS
          ? 'To install this app, open this page in Safari, tap Share, then choose “Add to Home Screen”.'
          : 'To install this app, open your browser menu and choose “Install app” or “Add to Home Screen”.');
        return;
      }

      const prompt = installPrompt;
      installPrompt = null;
      try {
        await prompt.prompt();
        const choice = await prompt.userChoice;
        if (choice.outcome === 'accepted') installButton.hidden = true;
      } catch (error) {
        console.error('App installation prompt failed:', error);
        window.alert('The browser could not start installation. Try installing from its menu.');
      }
    });

    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault();
      installPrompt = event;
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
