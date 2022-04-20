/**
 * Interface for In App Purchases items
 */
export interface IAP {
    id:number,
    iap_id:number,
    code: string,
    name: string,
    description: string,
    type: string,
    disabled: boolean;
    languages: IAP_language[]
}

export interface IAP_language{
    code: string,
    name: string,
    language_name: string,
    description: string
}
