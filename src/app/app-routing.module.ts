import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CatalogComponent } from './catalog/catalog.component';
import { ContactComponent } from './contact/contact.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "catalog",
    component: CatalogComponent,
  },
  {
    path: "contact",
    component: ContactComponent,
  },
  {
    path: "details",
    component: ProductDetailsComponent,
  },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
