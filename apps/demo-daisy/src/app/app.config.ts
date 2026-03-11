import {
  provideZonelessChangeDetection,
} from "@angular/core";
import { provideHttpClient } from "@angular/common/http";
import { provideRouter } from "@angular/router";
import { provideTranslateService } from "@ngx-translate/core";
import { provideTranslateHttpLoader } from "@ngx-translate/http-loader";
import { appRoutes } from "./app.routes";

export const appConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(appRoutes),
    provideHttpClient(),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: "/i18n/",
        suffix: ".json",
      }),
      fallbackLang: "en",
      lang: "en",
    }),
    ...provideTranslateHttpLoader({
      prefix: "./assets/i18n/",
      suffix: ".json",
    }),
  ],
};
