import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';

interface MaisonLine {
  text: string;
  em?: boolean;
}

interface MaisonSlide {
  image: string;
  alt: string;
  kicker: string;
  lines: MaisonLine[];
  lead: string;
  rail: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  active = 0;
  paused = false;

  readonly slides: MaisonSlide[] = [
    {
      image: 'assets/images/slider/furniture_slide3.jpg',
      alt: 'Дневна с мек диван, тъмни пана и месингово осветление',
      kicker: 'Belcaro · София',
      lines: [
        { text: 'Мебели' },
        { text: 'за проекта.', em: true }
      ],
      lead: 'Работим с дизайнери, за които детайлът е част от архитектурата на дома.',
      rail: 'Дневна'
    },
    {
      image: 'assets/images/collections/furniture_cate1.jpg',
      alt: 'Архитектурен диван в просторна дневна с бетон и светлина',
      kicker: 'Колекция',
      lines: [
        { text: 'Силует' },
        { text: 'и материя.', em: true }
      ],
      lead: 'Пропорция, тъкан и шев се решават заедно — не поотделно.',
      rail: 'Силует'
    },
    {
      image: 'assets/images/slider/furniture-banner-collection.jpg',
      alt: 'Спалня с висока тапицирана табла и меко осветление',
      kicker: 'По поръчка',
      lines: [
        { text: 'По мярка' },
        { text: 'на интериора.', em: true }
      ],
      lead: 'Размер и конфигурация по проекта. От срещата в шоурума до монтажа.',
      rail: 'Ателие'
    }
  ];

  private timer: ReturnType<typeof setInterval> | null = null;
  private reduced = false;

  ngOnInit(): void {
    document.body.classList.add('maison-home');
    window.scroll(0, 0);
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.arm();
  }

  ngOnDestroy(): void {
    this.disarm();
    document.body.classList.remove('maison-home');
  }

  @HostListener('document:visibilitychange')
  onVisibility(): void {
    if (document.hidden) {
      this.disarm();
      return;
    }
    this.arm();
  }

  go(index: number): void {
    const total = this.slides.length;
    this.active = (index + total) % total;
    this.arm();
  }

  next(): void {
    this.go(this.active + 1);
  }

  prev(): void {
    this.go(this.active - 1);
  }

  pause(): void {
    if (!window.matchMedia('(hover: hover)').matches) {
      return;
    }
    this.paused = true;
    this.disarm();
  }

  resume(): void {
    this.paused = false;
    this.arm();
  }

  private arm(): void {
    this.disarm();
    if (this.reduced || this.paused) {
      return;
    }
    this.timer = setInterval(() => {
      this.active = (this.active + 1) % this.slides.length;
    }, 7200);
  }

  private disarm(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
