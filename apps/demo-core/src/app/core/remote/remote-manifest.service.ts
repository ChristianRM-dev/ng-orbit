import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface RemoteManifest {
  readonly [remoteName: string]: string;
}

const DEFAULT_MANIFEST: RemoteManifest = {
  'demo-material': 'http://127.0.0.1:4201',
  'demo-daisy': 'http://127.0.0.1:4202'
};

@Injectable({ providedIn: 'root' })
export class RemoteManifestService {
  private readonly httpClient = inject(HttpClient);
  private readonly manifestState = signal<RemoteManifest>(DEFAULT_MANIFEST);
  readonly manifest = computed(() => this.manifestState());

  async loadManifest(): Promise<void> {
    try {
      const manifest = await firstValueFrom(
        this.httpClient.get<RemoteManifest>('./assets/federation.manifest.json')
      );
      this.manifestState.set({ ...DEFAULT_MANIFEST, ...manifest });
    } catch {
      this.manifestState.set(DEFAULT_MANIFEST);
    }
  }

  resolveRemoteBaseUrl(remoteName: string): string {
    return this.manifestState()[remoteName] ?? '';
  }
}
