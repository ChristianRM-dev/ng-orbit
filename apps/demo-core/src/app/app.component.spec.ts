import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { provideZonelessChangeDetection } from '@angular/core';

describe('AppComponent', () => {
  it('creates the application root component', async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([]),provideZonelessChangeDetection()]
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
