// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
console.log("window['env']");
console.log(window.location.protocol + '//' + window.location.host + '/');
export const environment = {
    production: false,
    appVersion: '1.0.0a',
    appPrefix: 'nwv2_dhmpz_',
    USERDATA_KEY: 'authf649fc9a5f55',
    isMockEnabled: true,
    adobeClientId: 'dc2939d2330a4191bb8069c1a2775ea5',
    stripePubKey: 'pk_test_51K1FF8BtgHko6Xgqi0uEMZRB4XgBnMVyPxhSR9GvUojRSSP7UgTx1aXfWvpURgzxdvxo47n6ADbqF8JFvDIcFEMR001sUplcBy',
    //apiUrl: window['env']['debug'] ? 'http://' + window['env']['domainName'] + '/' : 'https://' + window['env']['domainName'] + '/' || 'http://127.0.0.1:8000/',

    //apiUrl: 'http://127.0.0.1:8000/'
    //apiUrl: 'https://dashboard.nwicode.com/'
    //apiUrl: (window.location.hostname.includes("localhost") || window.location.hostname.includes("127.0.0.1") )?'http://localhost:8000/': 'https://' + window.location.hostname + '/'
    apiUrl: window.location.protocol + '//' + window.location.host + '/'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
