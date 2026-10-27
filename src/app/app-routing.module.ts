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
    data: {
      seo: {
        title: "Belcaro — луксозна мека мебел и интериор София",
        description:
          "Belcaro — премиум мека мебел, дивани, фотьойли и интериорни решения в София. Качество, дизайн и комфорт за вашия дом.",
        keywords:
          "мека мебел, дивани София, луксозни мебели, Belcaro, интериор, фотьойли",
      },
    },
  },
  {
    path: "catalog",
    loadChildren: () => import("./catalog/catalog.module").then(m => m.CatalogModule),
  },
  {
    path: "contact",
    component: ContactComponent,
    data: {
      seo: {
        title: "Контакти и шоурум",
        description:
          "Свържете се с Belcaro — запитвания, адрес на шоурум в София и консултация за мека мебел и интериор.",
        keywords: "Belcaro контакти, шоурум София, мека мебел запитване",
      },
    },
  },
  {
    path: "details",
    loadChildren: () => import("./product-details/product-details.module").then(m => m.ProductDetailsModule),
  },
  {
    path: "projects",
    component: ProjectsComponent,
    data: {
      seo: {
        title: "Реализирани проекти и интериори",
        description:
          "Вдъхновение от проекти на Belcaro — интериорни решения и мека мебел по индивидуални изисквания.",
        keywords: "Belcaro проекти, интериор, мека мебел реализации",
      },
    },
  },
  {
    path: "wishlist",
    component: WishlistComponent,
    data: {
      seo: {
        title: "Любими продукти",
        description:
          "Запазени любими артикули от каталога Belcaro — дивани, фотьойли и мека мебел.",
        keywords: "Belcaro любими, запазени продукти",
      },
    },
  },
  {
    path: "about",
    component: AboutComponent,
    data: {
      seo: {
        title: "За Belcaro",
        description:
          "Запознайте се с Belcaro — философия, качество и опит в премиум мека мебел и интериор.",
        keywords: "Belcaro за нас, луксозна мека мебел, компания",
      },
    },
  },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top',
    anchorScrolling: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
