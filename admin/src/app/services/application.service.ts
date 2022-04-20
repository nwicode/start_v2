import {Injectable} from '@angular/core';
import {RequestService} from './request.service';
import {IAP, IAP_language} from '../interfaces/iap';
import { Observable, Subject } from "rxjs";
import {environment} from "../../environments/environment";
import {TokenService} from "./token.service";

@Injectable({
    providedIn: 'root'
})
/**
 * Methods and properties for Application.
 */
export class ApplicationService {


    private mokupSubject = new Subject<any>();

    constructor(private request: RequestService, private token: TokenService) { }


    /**
     * Some action in side component action observable
     * @returns Observable
     */
    onMokupEvent(): Observable<any> {
        return this.mokupSubject.asObservable();
    }

    /**
     * Call from service
     * @param form form object
     */
    public createMokupEvent(event: string, form: any) {
        this.mokupSubject.next({event: event, data: form});
    }

    /**
     * Create new application.
     *
     * @param name
     * @param description
     * @param icon
     * @param iconBackgroundColor
     */
    async createApplication(name: string, description: string, icon: string, iconBackgroundColor: string) {
        let result: any;
        try {
            result = await this.request.makePostRequest('api/application', {
                name: name,
                description: description,
                icon: icon,
                icon_background_color: iconBackgroundColor
            });
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Load current user applications list.
     */
    async loadUserApplications() {
        let result: any;
        try {
            result = await this.request.makePostRequest('api/getCurrentUserApplications', {});
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Change disabled application field.
     *
     * @param appId application id
     * @param disabled application disabled field
     */
    async changeDisabledApplication(appId, disabled) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/changeDisabledApplication', {
                id: appId,
                disabled: disabled
            });

            data.is_error = false;
            result = data;

        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Change blocked application field.
     *
     * @param appId application id
     * @param blocked application blocked field
     */
    async changeBlockedApplication(appId, blocked) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/changeBlockedApplication', {
                id: appId,
                blocked: blocked
            });

            data.is_error = false;
            result = data;

        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Delete application.
     *
     * @param appId application id
     */
    async deleteApplication(appId) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/deleteApplication', {id: appId});

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Get application data.
     *
     * @param appId application id
     */
    async getApplicationById(appId) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/getApplicationById', {id: appId});

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }


    /**
     * Get application translation.
     *
     * @param appId application id
     */
    async getApplicationTranlsation(appId) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/getApplicationTranlsation', {id: appId});

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }


    /**
     * Get application menu.
     *
     * @param appId application id
     */
    async getApplicationMenu(appId) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/getApplicationMenu', {id: appId});

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }


    /**
     * store menu object to data
     * @param app_id application id
     * @param menu menu config
     * @returns response
     */
    async setApplicationMenu(app_id: number, menu: any[]) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/setApplicationMenu', {id: app_id, menu: menu});

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }


    /**
     * set application translation.
     *
     * @param appId application id
     */
    async setApplicationTranlsation(appId, translations) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/setApplicationTranlsation', {id: appId, translations: translations});

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Update application icon.
     *
     * @param appId application id
     * @param newIcon base64 application icon
     * @param icon_background_color
     */
    async updateApplicationIcon(appId, newIcon, icon_background_color) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/updateApplicationIcon', {
                id: appId,
                icon: newIcon,
                icon_background_color: icon_background_color
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Update application splash screen.
     *
     * @param appId application id
     * @param newSplashScreen base64 application splash screen
     * @param splashscreen_background_color
     * @param splashscreen_show_spinner
     * @param splashscreen_spinner_color
     * @param splashscreen_timeout
     */
    async updateApplicationSplashScreen(appId, newSplashScreen, splashscreen_background_color, splashscreen_show_spinner, splashscreen_spinner_color, splashscreen_timeout) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/updateApplicationSplashScreen', {
                id: appId,
                splash_screen: newSplashScreen,
                splashscreen_background_color: splashscreen_background_color,
                splashscreen_show_spinner: splashscreen_show_spinner,
                splashscreen_spinner_color: splashscreen_spinner_color,
                splashscreen_timeout: splashscreen_timeout
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Get application colors from core
     * @param appId application id
     * @returns
     */
    async getApplicationColors(appId: number) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/getApplicationColors', {id: appId});

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Set application color
     * @param appId Apliaction ID
     * @param colors_array colors object (key->value)
     * @returns
     */
    async setApplicationColors(appId: number, colors_array: any, background_mode: any = {}) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/setApplicationColors', {
                id: appId,
                colors: colors_array,
                background_mode: background_mode
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Get applications list.
     *
     * @param limit rows per page
     * @param start start position,
     * @param sort sort field
     * @param order sort order
     * @param filter filter string
     */
    async getApplications(limit: number = 25, start: number = 0, sort: string = '', order: string = '', filter: string = '') {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/getApplications', {
                limit: limit,
                start: start,
                sort: sort,
                order: order,
                filter: filter
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }


    /**
     * Set application IAP
     * @param appId Apliaction ID
     * @param iap iap object
     * @returns
     */
    async setApplicationIAP(appId: number, iap: IAP) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/setApplicationIAP', {id: appId, iap: iap});

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * remove IAP by id
     * @param appId Apliaction ID
     * @param colors_array colors object (key->value)
     * @returns
     */
    async removeApplicationIAP(appId: number, iap_id: number) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/removeApplicationIAP', {id: appId, iap_id: iap_id});

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Set application languages
     * @param appId Apliaction ID
     * @param languages languages object
     * @returns
     */
    async setApplicationLanguages(appId: number, languages: any, default_language: string) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/setApplicationLanguages', {
                id: appId,
                languages: languages,
                default_language: default_language
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Get application languages list..
     *
     * @param appId application id
     */
    async getApplicationLanguages(appId: number) {
        let result: any;
        try {
            let data = await this.request.makePostRequest("api/getApplicationLanguages", {appId: appId});

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Set application settings.
     *
     * @param appId application id
     * @param name application name
     * @param description application description
     * @param version application version
     * @param bundleId application bundleId
     * @param android application platform
     * @param ios application platform
     * @param pwa application platform
     * @param screenMode application screen mode
     */
    async setApplicationSettings(appId, name: string, description: string, version: string, bundleId: string, android: boolean, ios: boolean, pwa: boolean, screenMode: string) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/setApplicationSettings', {
                appId: appId,
                name: name,
                description: description,
                version: version,
                bundleId: bundleId,
                android: android,
                ios: ios,
                pwa: pwa,
                screenMode: screenMode
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Load application settings.
     *
     * @param appId application id
     */
    async getApplicationSettings(appId) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/getApplicationSettings', {appId: appId});

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Load AdMob settings.
     *
     * @param appId application id
     */
    async getAdMobSettings(appId) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/getAdMobSettings', {appId: appId});

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Set AdMob settings.
     *
     * @param appId application id
     * @param bannerId AdMob Banner id
     * @param interstitialId AdMob Interstitial id
     * @param rewardVideoAd Reward Video Ad
     * @param enableAdMob is enable AdMob
     */
    async setAdMobSettings(appId, bannerId: string, interstitialId: string, rewardVideoAd: string, enableAdMob: boolean) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/setAdMobSettings', {
                appId: appId,
                adMobBannerId: bannerId,
                adMobInterstitialId: interstitialId,
                rewardVideoAd: rewardVideoAd,
                adMobEnabled: enableAdMob
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Set application css.
     *
     * @param appId application id
     * @param application_css string with css code
     */
    async setApplicationCss(appId, application_css: string) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/setApplicationCss', {
                appId: appId,
                application_css: application_css
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Get application css.
     *
     * @param appId application id
     */
    async getApplicationCss(appId) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/getApplicationCss', {
                appId: appId
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Set OneSignal settings.
     *
     * @param appId application id
     * @param one_signal_id application OneSignal id
     * @param one_signal_enabled OneSignal push service enabled
     * @param one_signal_api_key OneSignal Api Key
     */
    async setOneSignalSettings(appId, one_signal_id: string, one_signal_enabled: boolean, one_signal_api_key: boolean) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/setOneSignalSettings', {
                appId: appId,
                one_signal_id: one_signal_id,
                one_signal_enabled: one_signal_enabled,
                one_signal_api_key: one_signal_api_key
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Get OneSignal settings.
     *
     * @param appId application id
     */
    async getOneSignalSettings(appId) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/getOneSignalSettings', {
                appId: appId
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Set Firebase settings.
     *
     * @param appId application id
     * @param google_services_json
     * @param google_services_plist
     * @param use_crashlytics
     */
    async setFirebaseSettings(appId, google_services_json: string, google_services_plist: string, use_crashlytics: boolean) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/setFirebaseSettings', {
                appId: appId,
                google_services_json: google_services_json,
                google_services_plist: google_services_plist,
                use_crashlytics: use_crashlytics
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Get Firebase settings.
     *
     * @param appId application id
     */
    async getFirebaseSettings(appId) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/getFirebaseSettings', {
                appId: appId
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Get settings for custom start animation.
     *
     * @param appId application id
     */
    async getCustomStartAnimationSettings(appId) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/getCustomStartAnimationSettings', {
                appId: appId
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Set settings for custom start animation.
     *
     * @param appId application id
     * @param html string with html code
     * @param css string with css code
     */
    async setCustomStartAnimationSettings(appId, html: string, css: string) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/setCustomStartAnimationSettings', {
                appId: appId,
                html: html,
                css: css
            });
            console.log('need_rebuild');

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Set MixPanel settings.
     *
     * @param appId application id
     * @param mixpanel_token application MixPanel token
     * @param mixpanel_enabled MixPanel service enabled
     */
    async setMixPanelSettings(appId, mixpanel_token: string, mixpanel_enabled: boolean) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/setMixPanelSettings', {
                appId: appId,
                mixpanel_token: mixpanel_token,
                mixpanel_enabled: mixpanel_enabled
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Get MixPanel settings.
     *
     * @param appId application id
     */
    async getMixPanelSettings(appId) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/getMixPanelSettings', {
                appId: appId
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    async setAnalyticsSettings(appId, analyticsViewID: string) {
        let result: any;
        try {
            const data = await this.request.makePostRequest('api/setGoogleAnalyticsSettings', {
                app_id: appId,
                analytics_view_id: analyticsViewID,
            });
            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }
        return result;
    }

    async getAnalyticsSettings(appId) {
        let result: any;
        try {
            const data = await this.request.makePostRequest('api/getGoogleAnalyticsSettings', {
                app_id: appId
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }


    /**
     * Set application privacy settings.
     *
     * @param appId application id
     * @param useDefaultPrivacy is use default privacy text
     * @param privacyText custom privacy text
     */
    async setApplicationPrivacy(appId: number | string, useDefaultPrivacy: boolean, privacyText: string) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/setApplicationPrivacy', {
                appId: appId,
                useDefaultPrivacy: useDefaultPrivacy,
                privacyText: privacyText
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Get default privacy for application.
     *
     * @param appId application id
     */
    async getDefaultApplicationPrivacy(appId: number | string) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/getDefaultApplicationPrivacy', {
                appId: appId
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Create new content type.
     *
     * @param appId application id
     * @param name content type name
     * @param structure content type fields
     */
    async createApplicationContentType(appId: number | string, name: string, structure: any) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/createContentType', {
                appId: appId,
                name: name,
                structure: structure
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Get application content list.
     *
     * @param appId application id
     * @param contentTypeId content type id
     * @param limit count record
     * @param offset number skip record
     * @param filter filter string
     * @param sortField sort field
     * @param sortDirection sorting direction
     */

    async getApplicationContentList(appId: number|string, contentTypeId: number|string, limit?: number, offset?: number, filter?: string, sortField?: string, sortDirection?: string ) {

        let result: any;
        try {
            let data = await this.request.makePostRequest('api/getApplicationContentList', {
                appId: appId,
                content_type_id: contentTypeId,
                limit: limit,
                offset: offset,
                filter: filter,
                sortField: sortField,
                sortDirection: sortDirection
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Get application content.
     *
     * @param appId application id
     * @param contentTypeId application content type id
     * @param contentId application content id
     */
    async getApplicationContent(appId: number | string, contentTypeId: number | string, contentId: number) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/getApplicationContent', {
                appId: appId,
                contentTypeId: contentTypeId,
                contentId: contentId
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Edit/create application content.
     *
     * @param appId application id
     * @param contentTypeId application content type id
     * @param contentId application content id
     * @param values object with content fields values
     */
    async setApplicationContent(appId: number | string, contentTypeId: number | string, contentId: number, values: any) {
        let result: any;
        try {
            let data = await this.request.makePostRequest('api/setApplicationContent', {
                appId: appId,
                contentTypeId: contentTypeId,
                contentId: contentId,
                values: values
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Delete application content.
     *
     * @param appId application id
     * @param contentId content id
     */
    async deleteApplicationContent(appId: number|string, contentId: number) {
        let result: any;
        try {
            let data = await this.request.makePostRequest("api/deleteApplicationContent", {
                appId: appId,
                contentId: contentId
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Get application content type list.
     *
     * @param appId
     */
    async getApplicationContentTypesList(appId: number|string) {
        let result: any;
        try {
            let data = await this.request.makePostRequest("api/getApplicationContentTypesList", {
                appId: appId
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Delete application content type with associated content.
     *
     * @param appId application id
     * @param contentTypeId content id
     */
    async deleteApplicationContentType(appId: number|string, contentTypeId: number|string) {
        let result: any;
        try {
            let data = await this.request.makePostRequest("api/deleteApplicationContentType", {
                appId: appId,
                contentTypeId: contentTypeId
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Get application content type.
     *
     * @param appId application id
     * @param contentTypeId content id
     */
    async getApplicationContentType(appId: number|string, contentTypeId: number|string) {
        let result: any;
        try {
            let data = await this.request.makePostRequest("api/getApplicationContentType", {
                appId: appId,
                contentTypeId: contentTypeId
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Edit application create type.
     *
     * @param appId application id
     * @param contentTypeId content type id
     * @param name content type name
     * @param structure content type field structure
     */
    async editApplicationContentType(appId: number|string, contentTypeId: number|string, name: string, structure: any) {
        let result: any;
        try {
            let data = await this.request.makePostRequest("api/editApplicationContentType", {
                appId: appId,
                contentTypeId: contentTypeId,
                name: name,
                structure: structure
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Save font to application.
     *
     * @param appId application id
     * @param fontFamily font family
     * @param fontFiles font files array
     * @param fontConnectionFile connection font file
     */
    async setApplicationFont(appId: string, fontFamily: string, fontFiles: any, fontConnectionFile: any) {
        let result: any;
        try {
            let formData = new FormData();
            formData.append('appId', appId);
            formData.append('fontFamily', fontFamily);
            for (let key in fontFiles) {
                formData.append(key, fontFiles[key]);
            }
            formData.append('fontConnectionFile', fontConnectionFile);

            let data;
            await fetch(environment.apiUrl + 'api/setApplicationFont', {
                method:'POST',
                body: formData,
                headers: {'Authorization': 'Bearer ' + this.token.get()}
            }).then(response => {
                if (response.status >= 400 && response.status < 600) {
                    throw new Error(response.statusText);
                }
                data = response;
                data.is_error = false;
                result = data;
            });
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Save custom font to application.
     *
     * @param appId application id
     * @param fontFamily font family name
     * @param fontFilesArchive archive with font files
     */
    async setApplicationCustomFont(appId: string, fontFamily: string, fontFilesArchive: any) {
        let result: any;
        try {
            let formData = new FormData();
            formData.append('appId', appId);
            formData.append('fontFamily', fontFamily);
            formData.append('fontFilesArchive', fontFilesArchive);

            let data;
            await fetch(environment.apiUrl + 'api/setApplicationCustomFont', {
                method:'POST',
                body: formData,
                headers: {'Authorization': 'Bearer ' + this.token.get()}
            }).then(response => {
                if (response.status >= 400 && response.status < 600) {
                    throw new Error(response.statusText);
                }
                data = response;
                data.is_error = false;
                result = data;
            });
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Get application fonts link.
     *
     * @param appId application id
     */
    async getApplicationFonts(appId: number|string) {
        let result: any;
        try {
            let data = await this.request.makePostRequest("api/getApplicationFonts", {
                appId: appId
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Copy application.
     *
     * @param appId application id
     */
    async copyApplication(appId: number|string) {
        let result: any;
        try {
            let data = await this.request.makePostRequest("api/copyApplication", {
                appId: appId
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Copy application.
     *
     * @param appId application id
     */
    async rebuildRequest(appId: number|string) {
        let result: any;
        try {
            let data = await this.request.makePostRequest("api/rebuildSources", {
                appId: appId
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    /**
     * Get list with templates information.
     */
    async getApplicationTemplateList() {
        let result: any;
        try {
            let data = await this.request.makePostRequest("api/getApplicationTemplateList", {});

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }
}
