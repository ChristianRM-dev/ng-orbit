import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-typescript';
import type { DocsCodeLanguage } from './docs.models';

@Component({
  selector: 'ng-orbit-docs-code-block',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './docs-code-block.component.html',
  styleUrl: './docs-code-block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocsCodeBlockComponent {
  private readonly destroyRef = inject(DestroyRef);

  readonly title = input('');
  readonly code = input.required<string>();
  readonly language = input<DocsCodeLanguage | undefined>(undefined);
  readonly copyable = input(true);
  protected readonly copied = signal(false);
  protected readonly resolvedLanguage = computed<DocsCodeLanguage>(() =>
    this.language() ?? inferLanguage(this.code())
  );
  protected readonly languageClass = computed(
    () => `language-${toPrismLanguage(this.resolvedLanguage())}`
  );
  protected readonly highlightedCode = computed(() =>
    highlightCode(this.code(), this.resolvedLanguage())
  );

  protected async copyCode(): Promise<void> {
    if (!this.copyable()) {
      return;
    }

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

function highlightCode(code: string, language: DocsCodeLanguage): string {
  if (language === 'text') {
    return escapeHtml(code);
  }

  const prismLanguage = toPrismLanguage(language);
  const grammar = Prism.languages[prismLanguage];

  if (!grammar) {
    return escapeHtml(code);
  }

  return Prism.highlight(code, grammar, prismLanguage);
}

function toPrismLanguage(language: DocsCodeLanguage): string {
  switch (language) {
    case 'bash':
      return 'bash';
    case 'typescript':
      return 'typescript';
    case 'markup':
      return 'markup';
    case 'scss':
      return 'scss';
    default:
      return 'text';
  }
}

function inferLanguage(code: string): DocsCodeLanguage {
  const trimmed = code.trim();

  if (!trimmed) {
    return 'text';
  }

  if (/^(pnpm|npm|yarn|bun)\s/m.test(trimmed)) {
    return 'bash';
  }

  if (/^[@.a-z-]+\s*[{:]/m.test(trimmed) && /;?\s*$/m.test(trimmed) && !trimmed.includes('<')) {
    return 'scss';
  }

  if (
    /(^import\s)|(@Component\()|(readonly\s+\w+)|(^export\s+class\s)|(^interface\s+\w+)/m.test(
      trimmed
    )
  ) {
    return 'typescript';
  }

  if (/^</m.test(trimmed) || /<section|<div|<form|<button|<orbit-/m.test(trimmed)) {
    return 'markup';
  }

  return 'text';
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
