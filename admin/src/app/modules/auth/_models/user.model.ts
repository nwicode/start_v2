import {AuthModel} from './auth.model';
import {AddressModel} from './address.model';
import {SocialNetworksModel} from './social-networks.model';

export class UserModel extends AuthModel {
    id: number;
    username: string;
    password: string;
    password_confirmation: string;
    fullname: string;
    name: string;
    email: string;
    code: string;
    ref: string;
    pic: string;
    roles: number[];
    occupation: string;
    companyName: string;
    phone: string;
    address?: AddressModel;
    socialNetworks?: SocialNetworksModel;
    // personal information
    firstname: string;
    lastname: string;
    website: string;
    // account information
    language: string;
    timeZone: string;
    communication: {
        email: boolean,
        sms: boolean,
        phone: boolean
    };
    // email settings
    emailSettings: {
        emailNotification: boolean,
        sendCopyToPersonalEmail: boolean,
        activityRelatesEmail: {
            youHaveNewNotifications: boolean,
            youAreSentADirectMessage: boolean,
            someoneAddsYouAsAsAConnection: boolean,
            uponNewOrder: boolean,
            newMembershipApproval: boolean,
            memberRegistration: boolean
        },
        updatesFromKeenthemes: {
            newsAboutKeenthemesProductsAndFeatureUpdates: boolean,
            tipsOnGettingMoreOutOfKeen: boolean,
            thingsYouMissedSindeYouLastLoggedIntoKeen: boolean,
            newsAboutMetronicOnPartnerProductsAndOtherServices: boolean,
            tipsOnMetronicBusinessProducts: boolean
        }
    };

  setUser(user: any) {
    this.id = user.id;
    this.username = user.username || '';
    this.name = user.name || '';
    this.lastname = user.lastname || '';
    this.password = user.password || '';
    this.password_confirmation = user.password_confirmation || '';
    this.fullname = user.fullname || '';
    this.email = user.email || '';
    this.pic = user.pic || './assets/media/users/default.jpg';
    this.roles = user.roles || [];
    this.occupation = user.occupation || '';
    this.companyName = user.companyName || '';
    this.phone = user.phone || '';
    this.code = user.code || '';
    this.ref = user.ref || '';
    this.address = user.address;
    this.socialNetworks = user.socialNetworks;
  }
}
