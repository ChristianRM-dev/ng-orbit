import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';
import { RemoteManifestService } from '../../core/remote/remote-manifest.service';

@Component({
  selector: 'ng-orbit-remote-iframe-page',
  standalone: true,
  imports: [TranslatePipe],
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

  try {
    const resolved = normalizedPath
      ? new URL(normalizedPath, withTrailingSlash(baseUrl))
      : new URL(baseUrl);

    if (resolved.protocol !== 'http:' && resolved.protocol !== 'https:') {
      return null;
    }

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
