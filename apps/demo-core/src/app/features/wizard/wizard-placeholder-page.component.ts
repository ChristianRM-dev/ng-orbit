import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ng-orbit-wizard-placeholder-page',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './wizard-placeholder-page.component.html',
  styleUrl: './wizard-placeholder-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardPlaceholderPageComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly titleKey = computed(
    () => this.route.snapshot.data['titleKey'] as string ?? 'wizard.placeholder.title'
  );
  protected readonly subtitleKey = computed(
    () =>
      this.route.snapshot.data['subtitleKey'] as string ?? 'wizard.placeholder.subtitle'
  );
}
