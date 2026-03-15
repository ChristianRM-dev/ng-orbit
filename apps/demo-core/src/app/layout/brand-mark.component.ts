import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ng-orbit-brand-mark',
  standalone: true,
  template: `
    <svg
      class="ng-orbit-brand-mark"
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 72 72"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="ng-orbit-brand-core" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="var(--ng-orbit-accent)" />
          <stop offset="100%" stop-color="var(--ng-orbit-signal)" />
        </linearGradient>
      </defs>

      <circle cx="36" cy="36" r="31" class="ng-orbit-brand-mark__rim" />
      <ellipse cx="36" cy="36" rx="27" ry="12" class="ng-orbit-brand-mark__orbit" />
      <ellipse
        cx="36"
        cy="36"
        rx="17"
        ry="29"
        class="ng-orbit-brand-mark__orbit ng-orbit-brand-mark__orbit--tilted"
      />
      <circle cx="36" cy="36" r="8.5" fill="url(#ng-orbit-brand-core)" />
      <circle cx="54" cy="25" r="4.2" class="ng-orbit-brand-mark__node" />
      <circle cx="20" cy="49" r="3.4" class="ng-orbit-brand-mark__node ng-orbit-brand-mark__node--muted" />
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      flex: 0 0 auto;
      line-height: 0;
    }

    .ng-orbit-brand-mark {
      display: block;
      overflow: visible;
    }

    .ng-orbit-brand-mark__rim {
      fill: rgb(255 255 255 / 0.04);
      stroke: var(--ng-orbit-line-strong);
      stroke-width: 1.4;
    }

    .ng-orbit-brand-mark__orbit {
      fill: none;
      stroke: var(--ng-orbit-line-strong);
      stroke-width: 1.4;
      stroke-linecap: round;
    }

    .ng-orbit-brand-mark__orbit--tilted {
      transform: rotate(24deg);
      transform-origin: 50% 50%;
    }

    .ng-orbit-brand-mark__node {
      fill: var(--ng-orbit-accent);
    }

    .ng-orbit-brand-mark__node--muted {
      fill: var(--ng-orbit-orbit);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandMarkComponent {
  readonly size = input(40);
}
