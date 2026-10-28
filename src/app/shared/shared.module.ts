import { NgModule } from '@angular/core';
import { CategoryPipe, ProductDescPipe, ProductNamePipe, TranslatePipe } from './translate.pipe';

@NgModule({
  declarations: [TranslatePipe, ProductNamePipe, ProductDescPipe, CategoryPipe],
  exports: [TranslatePipe, ProductNamePipe, ProductDescPipe, CategoryPipe],
})
export class SharedModule {}
