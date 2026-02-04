import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { ProjectsComponent } from './projects/projects.component';
import { WishlistComponent } from './wishlist/wishlist.component';

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "catalog",
    loadChildren: () => import("./catalog/catalog.module").then(m => m.CatalogModule),
  },
  {
    path: "contact",
    component: ContactComponent,
  },
  {
    path: "details",
    loadChildren: () => import("./product-details/product-details.module").then(m => m.ProductDetailsModule),
  },
  {
    path: "projects",
    component: ProjectsComponent,
  },
  {
    path: "wishlist",
    component: WishlistComponent,
  },
  {
    path: "about",
    component: AboutComponent,
  },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
