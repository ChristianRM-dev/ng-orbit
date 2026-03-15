import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface RemoteManifest {
  readonly [remoteName: string]: string;
}

const LOCAL_REMOTE_MANIFEST: RemoteManifest = {
  'demo-material': 'http://127.0.0.1:4201',
  'demo-daisy': 'http://127.0.0.1:4202'
};
const STATIC_REMOTE_MANIFEST: RemoteManifest = {
  'demo-material': 'material/',
  'demo-daisy': 'daisy/'
};
const MANIFEST_CANDIDATE_URLS: readonly string[] = [
  './federation.manifest.json',
  './assets/federation.manifest.json'
];

@Injectable({ providedIn: 'root' })
export class RemoteManifestService {
  private readonly httpClient = inject(HttpClient);
  private readonly manifestState = signal<RemoteManifest>(this.getRuntimeDefaults());
  readonly manifest = computed(() => this.manifestState());

  async loadManifest(): Promise<void> {
    for (const candidateUrl of MANIFEST_CANDIDATE_URLS) {
      try {
        const manifest = await firstValueFrom(
          this.httpClient.get<RemoteManifest>(candidateUrl)
        );
        this.manifestState.set(this.normalizeManifest({ ...this.getRuntimeDefaults(), ...manifest }));
        return;
      } catch {
        // Keep trying candidate URLs.
      }
    }

    this.manifestState.set(this.normalizeManifest(this.getRuntimeDefaults()));
  }

  resolveRemoteBaseUrl(remoteName: string): string {
    return this.manifestState()[remoteName] ?? '';
  }

  private normalizeManifest(manifest: RemoteManifest): RemoteManifest {
    const runtimeDefaults = this.getRuntimeDefaults();
    const isLocalRuntime = this.isLocalRuntime();

    return Object.fromEntries(
      Object.entries(manifest).map(([remoteName, value]) => {
        const normalizedValue = value.trim();
        const runtimeDefault = runtimeDefaults[remoteName] ?? '';

        if (!normalizedValue) {
          return [remoteName, runtimeDefault];
        }

        if (isAbsoluteUrl(normalizedValue)) {
          return [remoteName, normalizedValue];
        }

        if (isLocalRuntime) {
          return [remoteName, runtimeDefault];
        }

        return [remoteName, trimRelativeRemoteBase(normalizedValue)];
      })
    );
  }

  private getRuntimeDefaults(): RemoteManifest {
    return this.isLocalRuntime() ? LOCAL_REMOTE_MANIFEST : STATIC_REMOTE_MANIFEST;
  }

  private isLocalRuntime(): boolean {
    const hostname =
      typeof window !== 'undefined' && window.location ? window.location.hostname : '';
    return hostname === 'localhost' || hostname === '127.0.0.1';
  }
}

function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//.test(value);
}

function trimRelativeRemoteBase(value: string): string {
  return value.replace(/^\/+/, '');
}
