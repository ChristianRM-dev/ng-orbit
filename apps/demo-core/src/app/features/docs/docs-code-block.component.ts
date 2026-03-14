import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';

@Component({
  selector: 'ng-orbit-docs-code-block',
  standalone: true,
  templateUrl: './docs-code-block.component.html',
  styleUrl: './docs-code-block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocsCodeBlockComponent {
  private readonly destroyRef = inject(DestroyRef);

  readonly title = input('');
  readonly code = input.required<string>();
  protected readonly copied = signal(false);

  protected async copyCode(): Promise<void> {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(this.code());
      this.copied.set(true);

      const timeoutId = window.setTimeout(() => {
        this.copied.set(false);
      }, 1800);

      this.destroyRef.onDestroy(() => {
        window.clearTimeout(timeoutId);
      });
    } catch {
      this.copied.set(false);
    }
  }
}
