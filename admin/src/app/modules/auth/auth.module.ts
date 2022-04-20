import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthComponent } from './auth.component';
import {TranslationModule} from '../i18n/translation.module';
import {ModalComponent} from './modal/modal.component';
import {GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule} from "angularx-social-login";
import {ConfigService} from '../../services/config.service';
import { map } from 'rxjs/operators';

const socialConfigFactory = (configService: ConfigService) => {
  return configService.getClientConfig().pipe(map(config => {
      const providers = [];
      console.log('config', config);
      if (config?.google_web_client_id?.length > 0) {
          providers.push({
              id: GoogleLoginProvider.PROVIDER_ID,
              provider: new GoogleLoginProvider(
                  config.google_web_client_id
              ),
          });
      }

      return {
          autoLogin: false,
          providers: providers,
      } as SocialAuthServiceConfig;
  })).toPromise();
};


@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    LogoutComponent,
    AuthComponent,
    ModalComponent
  ],
  imports: [
    CommonModule,
    TranslationModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SocialLoginModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useFactory: socialConfigFactory,
      deps: [ConfigService]
    },
    /*{
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
                system_settings.google_web_client_id
            )
          }
        ]
      } as SocialAuthServiceConfig,
    }*/
  ]
})
export class AuthModule {}
