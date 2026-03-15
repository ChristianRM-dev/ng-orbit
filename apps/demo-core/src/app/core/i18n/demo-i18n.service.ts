import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

export type DemoLanguage = 'en' | 'es';

const STORAGE_KEY = 'ng-orbit.demo.language';
const SUPPORTED_LANGUAGES: readonly DemoLanguage[] = ['en', 'es'];

@Injectable({ providedIn: 'root' })
export class DemoI18nService {
  private readonly document = inject(DOCUMENT);
  private readonly translateService = inject(TranslateService);
  private readonly activeLanguage = signal<DemoLanguage>('en');
  private readonly initialLanguage: DemoLanguage;
  private initializePromise: Promise<void> | null = null;
  private languageRequestId = 0;
  readonly language = computed(() => this.activeLanguage());

  constructor() {
    this.translateService.addLangs([...SUPPORTED_LANGUAGES]);
    this.translateService.setFallbackLang('en');
    this.initialLanguage = this.resolveInitialLanguage();
  }

  initialize(): Promise<void> {
    if (this.initializePromise === null) {
      this.initializePromise = this.applyLanguage(this.initialLanguage);
    }

    return this.initializePromise;
  }

  setLanguage(language: DemoLanguage): Promise<void> {
    return this.applyLanguage(language);
  }

  private async applyLanguage(language: DemoLanguage): Promise<void> {
    if (!SUPPORTED_LANGUAGES.includes(language)) {
      return;
    }

    const requestId = ++this.languageRequestId;

    try {
      await firstValueFrom(this.translateService.use(language));

      if (requestId !== this.languageRequestId) {
        return;
      }

      this.activeLanguage.set(language);
      this.document.documentElement.lang = language;

      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, language);
      }
    } catch {
      // Keep previous language state if load fails.
    }
  }

  private resolveInitialLanguage(): DemoLanguage {
    if (typeof window !== 'undefined') {
      const languageFromQuery = new URLSearchParams(window.location.search).get('lang');
      if (languageFromQuery === 'en' || languageFromQuery === 'es') {
        return languageFromQuery;
      }
    }

    if (typeof window === 'undefined' || !window.localStorage) {
      return 'en';
    }

    const savedLanguage = window.localStorage.getItem(STORAGE_KEY);
    return savedLanguage === 'es' ? 'es' : 'en';
  }
}
