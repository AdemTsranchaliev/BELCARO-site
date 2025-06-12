import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CatalogComponent } from './catalog/catalog.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { ServicesComponent } from './services/services.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CommonserviceService } from './commonservice.service';
import { ProjectsComponent } from './projects/projects.component';
import { WishlistComponent } from './wishlist/wishlist.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: 'catalog/:category', component: CatalogComponent },
  { path: 'details/:id', component: ProductDetailsComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CatalogComponent,
    ContactComponent,
    AboutComponent,
    ServicesComponent,
    ProductDetailsComponent,
    ProjectsComponent,
    WishlistComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule
  ],
  providers: [CommonserviceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
