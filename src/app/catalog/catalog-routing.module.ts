import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogComponent } from './catalog.component';

const routes: Routes = [
  { path: 'Beds', redirectTo: 'beds', pathMatch: 'full' },
  { path: 'Tables', redirectTo: 'tables', pathMatch: 'full' },
  { path: 'Chairs', redirectTo: 'chairs', pathMatch: 'full' },
  { path: 'Sofas', redirectTo: 'sofas', pathMatch: 'full' },
  { path: 'Armchair', redirectTo: 'armchair', pathMatch: 'full' },
  {
    path: '',
    component: CatalogComponent,
  },
  {
    path: ':category',
    component: CatalogComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogRoutingModule {}
