import { Component, OnInit } from '@angular/core';

export type ProjectCategory = 'all' | 'residential' | 'commercial' | 'hospitality';

export interface ProjectItem {
  id: string;
  title: string;
  location: string;
  description: string;
  category: Exclude<ProjectCategory, 'all'>;
  image: string;
  alt: string;
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit {
  filter: ProjectCategory = 'all';

  readonly filterOptions: { id: ProjectCategory; label: string }[] = [
    { id: 'all', label: 'Всички' },
    { id: 'residential', label: 'Жилищни' },
    { id: 'commercial', label: 'Офис и търговски' },
    { id: 'hospitality', label: 'HoReCa' },
  ];

  readonly projects: ProjectItem[] = [
    {
      id: 'sofia-residence-living',
      title: 'Градска резиденция',
      location: 'София',
      description:
        'Цялостно обзавеждане на всекидневна и трапезария с акцент върху текстил и осветление.',
      category: 'residential',
      image: 'assets/images/collections/pr1.jpg',
      alt: 'Интериор всекидневна неутрални тонове',
    },
    {
      id: 'villa-soft-seating',
      title: 'Вила — мека зона',
      location: 'околностите на София',
      description:
        'Индивидуални размери на мека мебел и тапицирани панели по проект.',
      category: 'residential',
      image: 'assets/images/collections/pr2.jpg',
      alt: 'Мека мебел и панели в дом',
    },
    {
      id: 'office-hub',
      title: 'Офис площадка',
      location: 'София',
      description:
        'Работни места и зона за срещи — изчистени форми и издръжливи материали.',
      category: 'commercial',
      image: 'assets/images/collections/pr3.jpg',
      alt: 'Офис интериор с маса и столове',
    },
    {
      id: 'showroom-corner',
      title: 'Изложбен кът',
      location: 'Казичене',
      description:
        'Подбор на мостри и текстилни колекции за клиентски консултации.',
      category: 'commercial',
      image: 'assets/images/collections/pr4.jpg',
      alt: 'Изложба на мебели маса и акценти',
    },
    {
      id: 'apartment-dining',
      title: 'Апартамент',
      location: 'София',
      description:
        'Обзавеждане на трапезария и входно антре със спестена визия.',
      category: 'residential',
      image: 'assets/images/collections/pr5.jpg',
      alt: 'Трапезарна зона апартамент',
    },
    {
      id: 'restaurant-seating',
      title: 'Ресторант',
      location: 'България',
      description:
        'Тапицирани места за гости и устойчива употреба при интензивен поток.',
      category: 'hospitality',
      image: 'assets/images/collections/pr6.jpg',
      alt: 'Ресторантско обзавеждане столове и маси',
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

  categoryLabel(cat: ProjectItem['category']): string {
    const labels: Record<ProjectItem['category'], string> = {
      residential: 'Жилищен',
      commercial: 'Търговски',
      hospitality: 'HoReCa',
    };
    return labels[cat];
  }
}
