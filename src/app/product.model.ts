export class Product {
    Id: string;
    Name: string;
    Category: string;
    Image: string;
    ImageCount: number;
    Description: string; // changed from number to string
  
    constructor(id: string, name: string, category: string = '', image: string = '', imageCount: number = 0, description: string = '') {
      this.Id = id;
      this.Name = name;
      this.Category = category;
      this.Image = image;
      this.ImageCount = imageCount;
      this.Description = description;
    }
  }