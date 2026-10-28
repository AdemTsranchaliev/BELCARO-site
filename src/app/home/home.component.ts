import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { I18nService } from '../i18n.service';

interface MaisonLine {
  key: string;
  em?: boolean;
}

interface MaisonSlide {
  image: string;
  altKey: string;
  lines: MaisonLine[];
  leadKey: string;
  railKey: string;
}

interface InstagramPost {
  image: string;
  href: string;
  date: string;
  reel?: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  active = 0;
  paused = false;

  readonly instagram: InstagramPost[] = [
    { image: 'assets/images/instagram/01.webp', href: 'https://www.instagram.com/belcaro.bulgaria/p/DWg-wHTDgnz/', date: '2026-03-30' },
    { image: 'assets/images/instagram/02.webp', href: 'https://www.instagram.com/belcaro.bulgaria/reel/DVMKDbljP71/', date: '2026-02-25', reel: true },
    { image: 'assets/images/instagram/03.webp', href: 'https://www.instagram.com/belcaro.bulgaria/p/DVHGb1GDPLg/', date: '2026-02-23' },
    { image: 'assets/images/instagram/04.webp', href: 'https://www.instagram.com/belcaro.bulgaria/p/DUxQVUGDPF9/', date: '2026-02-14' },
    { image: 'assets/images/instagram/05.webp', href: 'https://www.instagram.com/belcaro.bulgaria/p/DUnmfTvjD0p/', date: '2026-02-11' },
    { image: 'assets/images/instagram/06.webp', href: 'https://www.instagram.com/belcaro.bulgaria/p/DUbMc_sjKCH/', date: '2026-02-06' },
  ];

  readonly slides: MaisonSlide[] = [
    {
      image: 'assets/images/slider/furniture_slide3.jpg',
      altKey: 'home.slide1.alt',
      lines: [
        { key: 'home.slide1.line1' },
        { key: 'home.slide1.line2', em: true }
      ],
      leadKey: 'home.slide1.lead',
      railKey: 'home.slide1.rail'
    },
    {
      image: 'assets/images/collections/furniture_cate1.jpg',
      altKey: 'home.slide2.alt',
      lines: [
        { key: 'home.slide2.line1' },
        { key: 'home.slide2.line2', em: true }
      ],
      leadKey: 'home.slide2.lead',
      railKey: 'home.slide2.rail'
    },
    {
      image: 'assets/images/slider/furniture-banner-collection.jpg',
      altKey: 'home.slide3.alt',
      lines: [
        { key: 'home.slide3.line1' },
        { key: 'home.slide3.line2', em: true }
      ],
      leadKey: 'home.slide3.lead',
      railKey: 'home.slide3.rail'
    }
  ];

  private timer: ReturnType<typeof setInterval> | null = null;
  private reduced = false;

  constructor(public i18n: I18nService) {}

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

  igDate(iso: string): string {
    const date = new Date(`${iso}T00:00:00`);
    return date.toLocaleDateString(this.i18n.lang === 'en' ? 'en-GB' : 'bg-BG', {
      day: 'numeric',
      month: 'short',
    });
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
