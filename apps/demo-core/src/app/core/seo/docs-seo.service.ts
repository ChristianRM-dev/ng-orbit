import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class DocsSeoService {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  update(config: {
    readonly title: string;
    readonly description: string;
    readonly path: string;
    readonly language: 'en' | 'es';
  }): void {
    const canonicalUrl = this.buildAbsoluteUrl(config.path, config.language);
    const englishUrl = this.buildAbsoluteUrl(config.path, 'en');
    const spanishUrl = this.buildAbsoluteUrl(config.path, 'es');
    const socialImage = this.buildAssetUrl('social-preview.svg');

    this.title.setTitle(config.title);
    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ property: 'og:image', content: socialImage });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: socialImage });

    this.upsertLink('canonical', canonicalUrl);
    this.upsertLink('alternate-en', englishUrl, { rel: 'alternate', hreflang: 'en' });
    this.upsertLink('alternate-es', spanishUrl, { rel: 'alternate', hreflang: 'es' });
    this.upsertLink('alternate-default', englishUrl, {
      rel: 'alternate',
      hreflang: 'x-default'
    });
  }

  private buildAbsoluteUrl(path: string, language: 'en' | 'es'): string {
    const normalizedPath = path.replace(/^\//, '');
    const baseHref = this.getBaseHref();
    const relativeUrl = withLeadingSlash(`${baseHref}${normalizedPath}`.replace(/\/{2,}/g, '/'));

    if (typeof window === 'undefined' || !window.location) {
      return language === 'es' ? `${relativeUrl}?lang=es` : relativeUrl;
    }

    const url = new URL(relativeUrl, window.location.origin);
    if (language === 'es') {
      url.searchParams.set('lang', 'es');
    } else {
      url.searchParams.delete('lang');
    }
    return url.toString();
  }

  private buildAssetUrl(assetPath: string): string {
    const relativeUrl = withLeadingSlash(
      `${this.getBaseHref()}${assetPath}`.replace(/\/{2,}/g, '/')
    );

    if (typeof window === 'undefined' || !window.location) {
      return relativeUrl;
    }

    return new URL(relativeUrl, window.location.origin).toString();
  }

  private getBaseHref(): string {
    return this.document.querySelector('base')?.getAttribute('href') ?? '/';
  }

  private upsertLink(
    key: string,
    href: string,
    attributes: {
      readonly rel?: string;
      readonly hreflang?: string;
    } = {}
  ): void {
    const linkId = `ng-orbit-${key}`;
    let link = this.document.head.querySelector<HTMLLinkElement>(`#${linkId}`);

    if (!link) {
      link = this.document.createElement('link');
      link.id = linkId;
      this.document.head?.appendChild(link);
    }

    link.rel = attributes.rel ?? key;
    link.href = href;
    if (attributes.hreflang) {
      link.hreflang = attributes.hreflang;
    } else {
      link.removeAttribute('hreflang');
    }
  }
}

function withLeadingSlash(value: string): string {
  return value.startsWith('/') ? value : `/${value}`;
}
