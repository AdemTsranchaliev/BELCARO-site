const CATEGORY_LABELS: Record<'bg' | 'en', Record<string, string>> = {
    bg: {
        sofas: 'Дивани',
        armchair: 'Фотьойли',
        chairs: 'Столове',
        beds: 'Спални',
        tables: 'Маси',
    },
    en: {
        sofas: 'Sofas',
        armchair: 'Armchairs',
        chairs: 'Chairs',
        beds: 'Beds',
        tables: 'Tables',
    },
};

export const CATEGORY_SLUGS = ['sofas', 'armchair', 'chairs', 'beds', 'tables'] as const;

export function categorySlug(value: string): string {
    return (value || '').trim().toLowerCase();
}

export function isCategorySlug(value: string): boolean {
    return (CATEGORY_SLUGS as readonly string[]).includes(categorySlug(value));
}

export function categoryLabel(value: string, lang: 'bg' | 'en' = 'bg'): string {
    const key = categorySlug(value);
    return CATEGORY_LABELS[lang][key] || CATEGORY_LABELS.bg[key] || value;
}

export class Product {
    Id: string;
    Name: string;
    Category: string;
    Image: string;
    ImageCount: number;
    Description: string; // changed from number to string
    Price?: number;
  
    constructor(
        id: string, 
        name: string, 
        category: string = '', 
        image: string = '', 
        imageCount: number = 0, 
        description: string = '',
        price?: number
    ) {
        this.Id = id;
        this.Name = name;
        this.Category = category;
        this.Image = image;
        this.ImageCount = imageCount;
        this.Description = description;
        this.Price = price;
    }
  }