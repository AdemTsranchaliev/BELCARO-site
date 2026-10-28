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
        title: "Belcaro — луксозна мека мебел и интериор в София",
        description:
          "Belcaro произвежда луксозна мека мебел в София: дивани, фотьойли, спални и маси по поръчка. Шоурум в Казичене.",
        keywords:
          "мека мебел, дивани София, фотьойли, спални, маси, мебели по поръчка, Belcaro",
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
        title: "Контакти и шоурум в София",
        description:
          "Шоурум Belcaro в Казичене, ул. Царски парк 4, и магазин на бул. Ботевградско шосе 268. Тел. 0899 908 588.",
        keywords: "Belcaro контакти, шоурум Казичене, мека мебел София",
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
        title: "Проекти и интериори",
        description:
          "Реализирани интериори с мека мебел Belcaro — частни домове и обществени пространства.",
        keywords: "Belcaro проекти, интериор по поръчка, мека мебел",
      },
    },
  },
  {
    path: "wishlist",
    component: WishlistComponent,
    data: {
      seo: {
        title: "Любими",
        description: "Запазени модели от каталога Belcaro.",
        noIndex: true,
      },
    },
  },
  {
    path: "about",
    component: AboutComponent,
    data: {
      seo: {
        title: "За Belcaro — мебели от 1995",
        description:
          "Belcaro произвежда луксозна мека мебел от 1995 г. Ателие в София, подбрани материи и мебели по мярка на интериора.",
        keywords: "Belcaro, мека мебел от 1995, производител мебели София",
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
