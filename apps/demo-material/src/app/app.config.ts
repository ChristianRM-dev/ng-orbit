import {
  APP_INITIALIZER,
  provideZonelessChangeDetection,
} from "@angular/core";
import { provideHttpClient } from "@angular/common/http";
import { provideRouter } from "@angular/router";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideTranslateService } from "@ngx-translate/core";
import { provideTranslateHttpLoader } from "@ngx-translate/http-loader";
import { appRoutes } from "./app.routes";
import { DemoI18nService } from "./core/i18n/demo-i18n.service";

export const appConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(appRoutes),
    provideAnimations(),
    provideHttpClient(),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: "./i18n/",
        suffix: ".json"
      }),
      fallbackLang: "en",
      lang: "en"
    }),
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [DemoI18nService],
      useFactory: (service: DemoI18nService) => () => service.initialize(),
    }
  ]
};
