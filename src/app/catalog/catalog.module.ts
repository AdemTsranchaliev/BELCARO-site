import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CatalogComponent } from './catalog.component';
import { CatalogRoutingModule } from './catalog-routing.module';

@NgModule({
  declarations: [CatalogComponent],
  imports: [
    CommonModule,
    RouterModule,
    CatalogRoutingModule,
  ],
})
export class CatalogModule {}
