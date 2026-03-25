import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { OrbitNotifyService } from '@ng-orbit/notify';

export type NotifyDocsPreviewVariant =
  | 'plain'
  | 'success-toast'
  | 'toast-action'
  | 'blocking-multi'
  | 'blocking-queue';

@Component({
  selector: 'ng-orbit-notify-docs-preview',
  standalone: true,
  templateUrl: './notify-docs-preview.component.html',
  styleUrl: './notify-docs-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotifyDocsPreviewComponent {
  private readonly notify = inject(OrbitNotifyService);

  readonly variant = input<NotifyDocsPreviewVariant>('plain');

  protected readonly latestResult = signal('No interaction yet.');
  protected readonly title = computed(() => {
    switch (this.variant()) {
      case 'success-toast':
        return 'Success toast';
      case 'toast-action':
        return 'Toast with Undo';
      case 'blocking-multi':
        return 'Multi-action blocking flow';
      case 'blocking-queue':
        return 'Blocking queue';
      default:
        return 'Global notify preview';
    }
  });

  protected readonly subtitle = computed(() => {
    switch (this.variant()) {
      case 'success-toast':
        return 'Fire a success toast with zero extra configuration and inspect the close result.';
      case 'toast-action':
        return 'Use one quick action for flows like Undo or Retry while the service still controls timing.';
      case 'blocking-multi':
        return 'A blocking prompt can resolve any action id, not only confirm/cancel.';
      case 'blocking-queue':
        return 'New blocking prompts wait in FIFO order until the current one resolves.';
      default:
        return 'The renderer is mounted once at app root while features only call the headless service.';
    }
  });

  protected async showSuccessToast(): Promise<void> {
    this.latestResult.set('Waiting for the toast to close...');
    const toastRef = this.notify.success({
      title: 'Saved',
      message: 'Draft saved successfully.'
    });

    const result = await toastRef.closed;
    this.latestResult.set(`Toast closed: ${formatToastResult(result)}`);
  }

  protected async showUndoToast(): Promise<void> {
    this.latestResult.set('Waiting for the toast action or timeout...');
    const toastRef = this.notify.show({
      title: 'Draft saved',
      message: 'Need to undo the last change?',
      tone: 'info',
      action: {
        id: 'undo',
        label: 'Undo',
        appearance: 'secondary'
      }
    });

    const result = await toastRef.closed;
    this.latestResult.set(`Toast result: ${formatToastResult(result)}`);
  }

  protected async openBlockingFlow(): Promise<void> {
    this.latestResult.set('Waiting for a blocking action...');
    const actionId = await this.notify.openBlocking({
      title: 'Review account changes',
      message: 'Choose what should happen with this account update before continuing.',
      tone: 'warning',
      actions: [
        { id: 'cancel', label: 'Keep editing', appearance: 'secondary' },
        { id: 'review', label: 'Send to review', appearance: 'primary' },
        { id: 'archive', label: 'Archive', appearance: 'danger' }
      ]
    });

    this.latestResult.set(`Blocking resolved with action: ${actionId}`);
  }

  protected async openBlockingQueue(): Promise<void> {
    this.latestResult.set('Queued two blocking notifications...');

    const firstPromise = this.notify.openBlocking({
      title: 'First checkpoint',
      message: 'Resolve this one before the next prompt becomes active.',
      tone: 'info',
      actions: [
        { id: 'cancel', label: 'Cancel', appearance: 'secondary' },
        { id: 'continue', label: 'Continue', appearance: 'primary' }
      ]
    });

    const secondPromise = this.notify.openBlocking({
      title: 'Second checkpoint',
      message: 'This prompt should wait behind the first one.',
      tone: 'warning',
      actions: [
        { id: 'back', label: 'Back', appearance: 'secondary' },
        { id: 'publish', label: 'Publish', appearance: 'primary' }
      ]
    });

    const firstResult = await firstPromise;
    const secondResult = await secondPromise;

    this.latestResult.set(`Queue resolved in order: ${firstResult} -> ${secondResult}`);
  }

  protected async openConfirmExample(): Promise<void> {
    this.latestResult.set('Waiting for confirm()...');
    const decision = await this.notify.confirm({
      title: 'Publish changes?',
      message: 'This confirm uses the blocking queue with confirm/cancel defaults.'
    });

    this.latestResult.set(`Confirm resolved with: ${decision}`);
  }

  protected clearToasts(): void {
    this.notify.clearToasts();
    this.latestResult.set('Cleared every toast in the queue.');
  }
}

function formatToastResult(result: {
  readonly reason: 'timeout' | 'dismiss' | 'action';
  readonly actionId?: string;
}): string {
  if (result.reason === 'action') {
    return `action:${result.actionId ?? 'unknown'}`;
  }

  return result.reason;
}
