import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal
} from '@angular/core';
import { NgStyle } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';
import { RemoteManifestService } from '../../core/remote/remote-manifest.service';

@Component({
  selector: 'ng-orbit-remote-iframe-page',
  standalone: true,
  imports: [NgStyle, TranslatePipe],
  templateUrl: './remote-iframe-page.component.html',
  styleUrl: './remote-iframe-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemoteIframePageComponent {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly remoteManifestService = inject(RemoteManifestService);

  readonly remoteName = input.required<string>();
  readonly remotePath = input.required<string>();
  readonly lang = input<'en' | 'es'>('en');
  readonly renderer = input<string>('');
  readonly frameHeight = input('640px');

  protected readonly iframeSrc = computed<SafeResourceUrl | null>(() => {
    const baseUrl = this.remoteManifestService.resolveRemoteBaseUrl(this.remoteName());

    if (!baseUrl) {
      return null;
    }

    const resolvedUrl = resolveRemoteUrl(baseUrl, this.remotePath(), {
      lang: this.lang(),
      renderer: this.renderer()
    });
    if (!resolvedUrl) {
      return null;
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(resolvedUrl);
  });

  protected readonly hasFrameError = signal(false);
  protected readonly frameStyles = computed(() => ({
    '--ng-orbit-remote-frame-height': this.frameHeight()
  }));

  protected onFrameLoad(): void {
    this.hasFrameError.set(false);
  }

  protected onFrameError(): void {
    this.hasFrameError.set(true);
  }
}

function resolveRemoteUrl(
  baseUrl: string,
  remotePath: string | undefined,
  queryParams: Record<string, string>
): string | null {
  const normalizedPath = remotePath?.trim() ?? '';
  const normalizedBaseUrl = baseUrl.trim();

  if (!normalizedBaseUrl) {
    return null;
  }

  if (!isAbsoluteUrl(normalizedBaseUrl)) {
    try {
      const relativeUrl = new URL(
        normalizeRelativeRemotePath(normalizedBaseUrl, normalizedPath),
        'https://ng-orbit.local/'
      );

      for (const [key, value] of Object.entries(queryParams)) {
        if (value) {
          relativeUrl.searchParams.set(key, value);
        }
      }

      return `${relativeUrl.pathname.replace(/^\/+/, '')}${relativeUrl.search}`;
    } catch {
      return null;
    }
  }

  try {
    const resolved = normalizedPath
      ? new URL(normalizedPath, withTrailingSlash(normalizedBaseUrl))
      : new URL(normalizedBaseUrl);

    for (const [key, value] of Object.entries(queryParams)) {
      if (value) {
        resolved.searchParams.set(key, value);
      }
    }

    return resolved.toString();
  } catch {
    return null;
  }
}

function withTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}

function normalizeRelativeRemotePath(baseUrl: string, remotePath: string): string {
  const sanitizedBase = withTrailingSlash(baseUrl.replace(/^\/+/, ''));
  const sanitizedPath = remotePath.replace(/^\/+/, '');
  return sanitizedPath ? `${sanitizedBase}${sanitizedPath}` : sanitizedBase;
}

function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//.test(value);
}
