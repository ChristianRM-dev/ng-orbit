import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrbitNotifyRenderPlainComponent } from '@ng-orbit/notify-render-plain';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'ng-orbit-root',
  standalone: true,
  imports: [RouterOutlet, OrbitNotifyRenderPlainComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
