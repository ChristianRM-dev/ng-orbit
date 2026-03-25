import { ChangeDetectionStrategy, Component, HostListener, computed, inject } from '@angular/core';
import {
  OrbitNotifyService,
  ORBIT_TOAST_POSITIONS,
  type OrbitToast,
  type OrbitToastPosition
} from '@ng-orbit/notify';

/**
 * Reference semantic renderer for {@link OrbitNotifyService}.
 *
 * @remarks
 * This renderer mounts both the visible toast stack and the blocking notification shell.
 * Business side effects still belong to the consumer after each action resolves.
 */
@Component({
  selector: 'orbit-notify-render-plain',
  standalone: true,
  templateUrl: './orbit-notify-render-plain.component.html',
  styleUrl: './orbit-notify-render-plain.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrbitNotifyRenderPlainComponent {
  protected readonly notify = inject(OrbitNotifyService);
  protected readonly positions = ORBIT_TOAST_POSITIONS;
  protected readonly blocking = this.notify.activeBlocking;

  protected readonly toastGroups = computed(() => {
    const groups = createEmptyToastGroups();

    for (const toast of this.notify.toasts()) {
      groups[toast.position].push(toast);
    }

    return groups;
  });

  @HostListener('document:keydown.escape')
  protected onEscapeKey(): void {
    this.notify.dismissBlocking('escape');
  }

  protected onToastMouseEnter(toastId: string): void {
    this.notify.pauseToast(toastId);
  }

  protected onToastMouseLeave(toastId: string): void {
    this.notify.resumeToast(toastId);
  }

  protected onToastAction(toastId: string): void {
    this.notify.triggerToastAction(toastId);
  }

  protected onToastDismiss(toastId: string): void {
    this.notify.dismissToast(toastId);
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target !== event.currentTarget) {
      return;
    }

    this.notify.dismissBlocking('backdrop');
  }

  protected onBlockingAction(actionId: string): void {
    this.notify.runBlockingAction(actionId);
  }

  protected toastRole(tone: string): 'status' | 'alert' {
    return tone === 'error' || tone === 'warning' ? 'alert' : 'status';
  }
}

function createEmptyToastGroups(): Record<OrbitToastPosition, OrbitToast[]> {
  return {
    'top-start': [],
    'top-center': [],
    'top-end': [],
    'bottom-start': [],
    'bottom-center': [],
    'bottom-end': []
  };
}
