import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RemoteIframePageComponent } from '../remote/remote-iframe-page.component';
import type {
  DocsComponentPreview,
  DocsIframePreview,
  DocsPreviewConfig
} from './docs.models';

@Component({
  selector: 'ng-orbit-docs-preview-host',
  standalone: true,
  imports: [NgComponentOutlet, RemoteIframePageComponent],
  styleUrl: './docs-preview-host.component.scss',
  template: `
    @if (componentPreview()) {
      <ng-container
        *ngComponentOutlet="
          componentPreview()!.component;
          inputs: componentPreview()!.inputs ?? {}
        "
      />
    }

    @if (iframePreview()) {
      <ng-orbit-remote-iframe-page
        [remoteName]="iframePreview()!.remoteName"
        [remotePath]="iframePreview()!.remotePath"
        lang="en"
        [renderer]="iframePreview()!.renderer ?? ''"
        [frameHeight]="iframePreview()!.frameHeight ?? '640px'"
      />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocsPreviewHostComponent {
  readonly preview = input.required<DocsPreviewConfig>();

  protected readonly componentPreview = computed<DocsComponentPreview | null>(() => {
    const preview = this.preview();
    return preview.kind === 'component' ? preview : null;
  });

  protected readonly iframePreview = computed<DocsIframePreview | null>(() => {
    const preview = this.preview();
    return preview.kind === 'iframe' ? preview : null;
  });
}
