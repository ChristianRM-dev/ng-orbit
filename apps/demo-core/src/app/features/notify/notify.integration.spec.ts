import { ChangeDetectionStrategy, Component, inject, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OrbitNotifyService, provideOrbitNotify } from '@ng-orbit/notify';
import { OrbitNotifyRenderPlainComponent } from '@ng-orbit/notify-render-plain';

@Component({
  standalone: true,
  imports: [OrbitNotifyRenderPlainComponent],
  template: `<orbit-notify-render-plain />`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class NotifyHostComponent {
  readonly notify = inject(OrbitNotifyService);
}

describe('notify integration', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotifyHostComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideOrbitNotify({
          toast: {
            visibleLimit: 1
          }
        })
      ]
    }).compileComponents();
  });

  it('renders the toast stack at top-end and shows a single toast action', async () => {
    const fixture = TestBed.createComponent(NotifyHostComponent);
    const notify = fixture.componentInstance.notify;

    notify.show({
      message: 'Draft saved',
      action: {
        id: 'undo',
        label: 'Undo'
      }
    });

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const stack = fixture.nativeElement.querySelector(
      '.orbit-notify-stack--top-end'
    ) as HTMLElement | null;
    const actions = fixture.nativeElement.querySelectorAll('.orbit-notify-toast__action');

    expect(stack).not.toBeNull();
    expect(actions.length).toBe(1);
    expect(actions[0].textContent?.trim()).toBe('Undo');
  });

  it('resolves the toast close promise with the action id', async () => {
    const fixture = TestBed.createComponent(NotifyHostComponent);
    const notify = fixture.componentInstance.notify;
    const resultPromise = notify.show({
      message: 'Draft saved',
      action: {
        id: 'undo',
        label: 'Undo'
      }
    }).closed;

    fixture.detectChanges();
    await settle(fixture);

    const actionButton = fixture.nativeElement.querySelector(
      '.orbit-notify-toast__action'
    ) as HTMLButtonElement;
    actionButton.click();
    fixture.detectChanges();
    const result = await resultPromise;

    expect(result).toEqual({
      reason: 'action',
      actionId: 'undo'
    });
  });

  it('does not dismiss blocking notifications with backdrop or Escape by default', async () => {
    const fixture = TestBed.createComponent(NotifyHostComponent);
    const notify = fixture.componentInstance.notify;

    let resolvedActionId: string | undefined;
    notify
      .openBlocking({
        title: 'Delete item?',
        actions: [
          { id: 'cancel', label: 'Cancel', appearance: 'secondary' },
          { id: 'delete', label: 'Delete', appearance: 'danger' }
        ]
      })
      .then((actionId) => {
        resolvedActionId = actionId;
      });

    fixture.detectChanges();
    await settle(fixture);

    const backdrop = fixture.nativeElement.querySelector(
      '.orbit-notify-modal-backdrop'
    ) as HTMLDivElement;
    backdrop.click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    await settle(fixture);

    expect(fixture.nativeElement.querySelector('.orbit-notify-modal')).not.toBeNull();
    expect(resolvedActionId).toBeUndefined();
  });

  it('dismisses blocking notifications through Escape and backdrop when enabled', async () => {
    const fixture = TestBed.createComponent(NotifyHostComponent);
    const notify = fixture.componentInstance.notify;
    const escapePromise = notify.openBlocking({
      title: 'Leave page?',
      closeOnEscape: true,
      actions: [
        { id: 'cancel', label: 'Stay', appearance: 'secondary' },
        { id: 'leave', label: 'Leave', appearance: 'primary' }
      ]
    });

    fixture.detectChanges();
    await settle(fixture);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    const escapeResult = await escapePromise;

    expect(escapeResult).toBe('cancel');

    const backdropPromise = notify.openBlocking({
      title: 'Discard draft?',
      closeOnBackdrop: true,
      actions: [
        { id: 'back', label: 'Back', appearance: 'secondary' },
        { id: 'discard', label: 'Discard', appearance: 'danger' }
      ]
    });

    fixture.detectChanges();
    await settle(fixture);

    const backdrop = fixture.nativeElement.querySelector(
      '.orbit-notify-modal-backdrop'
    ) as HTMLDivElement;
    backdrop.click();
    fixture.detectChanges();
    const backdropResult = await backdropPromise;

    expect(backdropResult).toBe('back');
  });

  it('queues blocking notifications in FIFO order', async () => {
    const fixture = TestBed.createComponent(NotifyHostComponent);
    const notify = fixture.componentInstance.notify;

    const firstPromise = notify.openBlocking({
      title: 'First checkpoint',
      actions: [
        { id: 'cancel', label: 'Cancel', appearance: 'secondary' },
        { id: 'continue', label: 'Continue', appearance: 'primary' }
      ]
    });

    const secondPromise = notify.openBlocking({
      title: 'Second checkpoint',
      actions: [
        { id: 'back', label: 'Back', appearance: 'secondary' },
        { id: 'publish', label: 'Publish', appearance: 'primary' }
      ]
    });

    fixture.detectChanges();
    await settle(fixture);

    expect(fixture.nativeElement.textContent).toContain('First checkpoint');
    expect(fixture.nativeElement.textContent).not.toContain('Second checkpoint');

    const firstPrimary = fixture.nativeElement.querySelector(
      '.orbit-notify-modal__button--primary'
    ) as HTMLButtonElement;
    firstPrimary.click();
    fixture.detectChanges();
    const firstResult = await firstPromise;
    await settle(fixture);

    expect(firstResult).toBe('continue');
    expect(fixture.nativeElement.textContent).toContain('Second checkpoint');

    const secondPrimary = fixture.nativeElement.querySelector(
      '.orbit-notify-modal__button--primary'
    ) as HTMLButtonElement;
    secondPrimary.click();
    fixture.detectChanges();
    const secondResult = await secondPromise;

    expect(secondResult).toBe('publish');
  });

  it('starts queued toast timers only after the toast becomes visible', async () => {
    const fixture = TestBed.createComponent(NotifyHostComponent);
    const notify = fixture.componentInstance.notify;

    let firstClosed = false;
    let secondClosed = false;
    const firstClosedPromise = notify.show({ message: 'First', durationMs: 60 }).closed.then(() => {
      firstClosed = true;
    });
    const secondClosedPromise = notify.show({ message: 'Second', durationMs: 60 }).closed.then(() => {
      secondClosed = true;
    });

    fixture.detectChanges();
    await settle(fixture);

    await sleep(75);
    await firstClosedPromise;
    fixture.detectChanges();
    await settle(fixture);

    expect(firstClosed).toBe(true);
    expect(secondClosed).toBe(false);
    expect(fixture.nativeElement.textContent).toContain('Second');

    await sleep(30);
    expect(secondClosed).toBe(false);

    await sleep(50);
    await secondClosedPromise;
    expect(secondClosed).toBe(true);
  });
});

async function settle(fixture: { detectChanges(): void; whenStable(): Promise<unknown> }): Promise<void> {
  await fixture.whenStable();
  fixture.detectChanges();
  await Promise.resolve();
}

function sleep(durationMs: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, durationMs);
  });
}
