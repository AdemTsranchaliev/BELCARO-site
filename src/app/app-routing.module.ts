import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CatalogComponent } from './catalog/catalog.component';
import { ContactComponent } from './contact/contact.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { ProjectsComponent } from './projects/projects.component';

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "catalog/:category",
    component: CatalogComponent,
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
    path: "details/:id",
    component: ProductDetailsComponent,
  },
  {
    path: "projects",
    component: ProjectsComponent,
  },
  {
    path: "about",
    component: AboutComponent,
  },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })], // Enable hash-based routing
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }] // Optional
})

export class AppRoutingModule { }
