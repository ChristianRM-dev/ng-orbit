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
const MANIFEST_CANDIDATE_URLS: readonly string[] = [
  './federation.manifest.json',
  './assets/federation.manifest.json'
];

@Injectable({ providedIn: 'root' })
export class RemoteManifestService {
  private readonly httpClient = inject(HttpClient);
  private readonly manifestState = signal<RemoteManifest>(DEFAULT_MANIFEST);
  readonly manifest = computed(() => this.manifestState());

  async loadManifest(): Promise<void> {
    for (const candidateUrl of MANIFEST_CANDIDATE_URLS) {
      try {
        const manifest = await firstValueFrom(
          this.httpClient.get<RemoteManifest>(candidateUrl)
        );
        this.manifestState.set({ ...DEFAULT_MANIFEST, ...manifest });
        return;
      } catch {
        // Keep trying candidate URLs.
      }
    }

    this.manifestState.set(DEFAULT_MANIFEST);
  }

  resolveRemoteBaseUrl(remoteName: string): string {
    return this.manifestState()[remoteName] ?? '';
  }
}
