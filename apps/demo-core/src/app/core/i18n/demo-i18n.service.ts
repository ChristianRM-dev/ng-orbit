import { Injectable, computed, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type DemoLanguage = 'en' | 'es';

const STORAGE_KEY = 'ng-orbit.demo.language';
const SUPPORTED_LANGUAGES: readonly DemoLanguage[] = ['en', 'es'];

@Injectable({ providedIn: 'root' })
export class DemoI18nService {
  private readonly translateService = inject(TranslateService);
  private readonly activeLanguage = signal<DemoLanguage>('en');
  readonly language = computed(() => this.activeLanguage());

  constructor() {
    this.translateService.addLangs([...SUPPORTED_LANGUAGES]);
    this.translateService.setFallbackLang('en');

    const initialLanguage = this.resolveInitialLanguage();
    this.setLanguage(initialLanguage);
  }

  setLanguage(language: DemoLanguage): void {
    if (!SUPPORTED_LANGUAGES.includes(language)) {
      return;
    }

    this.activeLanguage.set(language);
    this.translateService.use(language);

    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, language);
    }
  }

  private resolveInitialLanguage(): DemoLanguage {
    if (typeof window === 'undefined' || !window.localStorage) {
      return 'en';
    }

    const savedLanguage = window.localStorage.getItem(STORAGE_KEY);
    return savedLanguage === 'es' ? 'es' : 'en';
  }
}
