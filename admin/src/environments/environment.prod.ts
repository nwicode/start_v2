export const environment = {
  production: true,
  appVersion: '1.0.0a',
  USERDATA_KEY: 'authf649fc9a5f55',
  appPrefix: 'nwv2_dhmpz_',
  adobeClientId: 'dc2939d2330a4191bb8069c1a2775ea5',
  isMockEnabled: true,
  //apiUrl: 'http://localhost:8000/',
  // apiUrl: window['env']['debug'] ? 'http://' + window['env']['domainName'] + '/' : 'https://' + window['env']['domainName'] + '/' || 'http://127.0.0.1:8000/',
  apiUrl: (window.location.hostname.includes("localhost") || window.location.hostname.includes("127.0.0.1") )?'http://localhost:8000/': 'https://' + window.location.hostname + '/'
};
