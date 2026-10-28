import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CatalogComponent } from './catalog.component';
import { CatalogRoutingModule } from './catalog-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [CatalogComponent],
  imports: [
    CommonModule,
    RouterModule,
    CatalogRoutingModule,
    SharedModule,
  ],
})
export class CatalogModule {}
