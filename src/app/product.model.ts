const CATEGORY_LABELS: Record<string, string> = {
    sofas: 'Дивани',
    armchair: 'Фотьойли',
    chairs: 'Столове',
    beds: 'Спални',
    tables: 'Маси',
};

export function categoryLabel(value: string): string {
    const key = (value || '').trim().toLowerCase();
    return CATEGORY_LABELS[key] || value;
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