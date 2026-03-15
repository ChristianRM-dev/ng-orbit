import { APP_INITIALIZER, provideZonelessChangeDetection } from "@angular/core";
import { provideHttpClient } from "@angular/common/http";
import { provideRouter } from "@angular/router";
import { provideTranslateService } from "@ngx-translate/core";
import { provideTranslateHttpLoader } from "@ngx-translate/http-loader";
import { appRoutes } from "./app.routes";
import { DemoI18nService } from "./core/i18n/demo-i18n.service";
import { RemoteManifestService } from "./core/remote/remote-manifest.service";

export const appConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(appRoutes),
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
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [RemoteManifestService],
      useFactory: (service: RemoteManifestService) => () => service.loadManifest()
    }
  ]
};
