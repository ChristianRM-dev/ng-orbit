import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  private readonly route = inject(ActivatedRoute);
  private readonly remoteManifestService = inject(RemoteManifestService);

  protected readonly titleKey = computed(
    () => this.route.snapshot.data['titleKey'] as string ?? 'remote.title'
  );
  protected readonly subtitleKey = computed(
    () => this.route.snapshot.data['subtitleKey'] as string ?? 'remote.subtitle'
  );

  protected readonly iframeSrc = computed(() => {
    const remoteName = this.route.snapshot.data['remoteName'] as string;
    const remotePath = this.route.snapshot.data['remotePath'] as string;
    const baseUrl = this.remoteManifestService.resolveRemoteBaseUrl(remoteName);

    if (!baseUrl) {
      return '';
    }

    if (!remotePath) {
      return baseUrl;
    }

    return `${baseUrl}${remotePath.startsWith('/') ? '' : '/'}${remotePath}`;
  });

  protected readonly hasFrameError = signal(false);

  protected onFrameLoad(): void {
    this.hasFrameError.set(false);
  }

  protected onFrameError(): void {
    this.hasFrameError.set(true);
  }
}
