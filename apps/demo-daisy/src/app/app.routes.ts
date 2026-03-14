import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'table/daisy'
  },
  {
    path: 'table/daisy',
    loadComponent: () =>
      import('./features/table/table-daisy-page.component').then(
        (module) => module.TableDaisyPageComponent
      )
  },
  {
    path: 'wizard/daisy',
    loadComponent: () =>
      import('./features/wizard/wizard-daisy-page.component').then(
        (module) => module.WizardDaisyPageComponent
      )
  },
  {
    path: '**',
    redirectTo: 'table/daisy'
  }
];
