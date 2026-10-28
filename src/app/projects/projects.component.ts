import { Component, OnInit } from '@angular/core';

export type ProjectCategory = 'all' | 'residential' | 'commercial' | 'hospitality';

export interface ProjectItem {
  id: string;
  titleKey: string;
  locationKey: string;
  descriptionKey: string;
  category: Exclude<ProjectCategory, 'all'>;
  image: string;
  altKey: string;
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit {
  filter: ProjectCategory = 'all';

  readonly filterOptions: { id: ProjectCategory; labelKey: string }[] = [
    { id: 'all', labelKey: 'projects.filter.all' },
    { id: 'residential', labelKey: 'projects.filter.residential' },
    { id: 'commercial', labelKey: 'projects.filter.commercial' },
    { id: 'hospitality', labelKey: 'projects.filter.hospitality' },
  ];

  readonly projects: ProjectItem[] = [
    {
      id: 'sofia-residence-living',
      titleKey: 'projects.item.sofia.title',
      locationKey: 'projects.item.sofia.location',
      descriptionKey: 'projects.item.sofia.desc',
      category: 'residential',
      image: 'assets/images/collections/pr1.jpg',
      altKey: 'projects.item.sofia.alt',
    },
    {
      id: 'villa-soft-seating',
      titleKey: 'projects.item.villa.title',
      locationKey: 'projects.item.villa.location',
      descriptionKey: 'projects.item.villa.desc',
      category: 'residential',
      image: 'assets/images/collections/pr2.jpg',
      altKey: 'projects.item.villa.alt',
    },
    {
      id: 'office-hub',
      titleKey: 'projects.item.office.title',
      locationKey: 'projects.item.office.location',
      descriptionKey: 'projects.item.office.desc',
      category: 'commercial',
      image: 'assets/images/collections/pr3.jpg',
      altKey: 'projects.item.office.alt',
    },
    {
      id: 'showroom-corner',
      titleKey: 'projects.item.showroom.title',
      locationKey: 'projects.item.showroom.location',
      descriptionKey: 'projects.item.showroom.desc',
      category: 'commercial',
      image: 'assets/images/collections/pr4.jpg',
      altKey: 'projects.item.showroom.alt',
    },
    {
      id: 'apartment-dining',
      titleKey: 'projects.item.apartment.title',
      locationKey: 'projects.item.apartment.location',
      descriptionKey: 'projects.item.apartment.desc',
      category: 'residential',
      image: 'assets/images/collections/pr5.jpg',
      altKey: 'projects.item.apartment.alt',
    },
    {
      id: 'restaurant-seating',
      titleKey: 'projects.item.restaurant.title',
      locationKey: 'projects.item.restaurant.location',
      descriptionKey: 'projects.item.restaurant.desc',
      category: 'hospitality',
      image: 'assets/images/collections/pr6.jpg',
      altKey: 'projects.item.restaurant.alt',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  setFilter(cat: ProjectCategory): void {
    this.filter = cat;
  }

  get filteredProjects(): ProjectItem[] {
    if (this.filter === 'all') {
      return this.projects;
    }
    return this.projects.filter((p) => p.category === this.filter);
  }

  trackById(_index: number, item: ProjectItem): string {
    return item.id;
  }

}
