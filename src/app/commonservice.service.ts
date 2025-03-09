import { Injectable } from '@angular/core';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class CommonserviceService {

  constructor() { }


  public GetProducts(){
    const products: Product[] = [
      new Product('Alabama', 'Alabama', 'Sofas', 'Alabama', 5, 'Описание на продукта...'),
      new Product('Alexa', 'Alexa', 'Sofas', 'Alexa', 3, 'Описание на продукта...'),
      new Product('Arkansas', 'Arkansas', 'Sofas', 'Arkansas', 4, 'Описание на продукта...'),
      new Product('Arriet', 'Arriet', 'Sofas', 'Arriet', 5, 'Описание на продукта...'),
      new Product('Bruno', 'Bruno', 'Sofas', 'Bruno', 4, 'Описание на продукта...'),
      new Product('Cloud', 'Cloud', 'Sofas', 'Cloud', 7, 'Описание на продукта...'),
      new Product('Falconi', 'Falconi', 'Sofas', 'Falconi', 4, 'Описание на продукта...'),
      new Product('Florida', 'Florida', 'Sofas', 'Florida', 5, 'Описание на продукта...'),
      new Product('Galisia', 'Galisia', 'Sofas', 'Galisia', 7, 'Описание на продукта...'),
      new Product('Georgia', 'Georgia', 'Sofas', 'Georgia', 2, 'Описание на продукта...'),
      new Product('Hamilton', 'Hamilton', 'Sofas', 'Hamilton', 2, 'Описание на продукта...'),
      new Product('Hermes', 'Hermes', 'Sofas', 'Hermes', 5, 'Описание на продукта...'),
      new Product('Icon', 'Icon', 'Sofas', 'Icon', 7, 'Описание на продукта...'),
      new Product('Jordan', 'Jordan', 'Sofas', 'Jordan', 2, 'Описание на продукта...'),
      new Product('Kordoba', 'Kordoba', 'Sofas', 'Kordoba', 5, 'Описание на продукта...'),
      new Product('Kortina', 'Kortina', 'Sofas', 'Kortina', 4, 'Описание на продукта...'),
      new Product('Leon', 'Leon', 'Sofas', 'Leon', 6, 'Описание на продукта...'),
      new Product('Lima', 'Lima', 'Sofas', 'Lima', 4, 'Описание на продукта...'),
      new Product('Livorno', 'Livorno', 'Sofas', 'Livorno', 5, 'Описание на продукта...'),
      new Product('Moka', 'Moka', 'Sofas', 'Moka', 5, 'Описание на продукта...'),
      new Product('Monaco', 'Monaco', 'Sofas', 'Monaco', 2, 'Описание на продукта...'),
      new Product('Morgan', 'Morgan', 'Sofas', 'Morgan', 6, 'Описание на продукта...'),
      new Product('Mundo', 'Mundo', 'Sofas', 'Mundo', 3, 'Описание на продукта...'),
      new Product('Nevada', 'Nevada', 'Sofas', 'Nevada', 4, 'Описание на продукта...'),
      new Product('New Jersey', 'New Jersey', 'Sofas', 'New-Jersey', 6, 'Описание на продукта...'),
      new Product('Nik', 'Nik', 'Sofas', 'Nik', 5, 'Описание на продукта...'),
      new Product('Odineze', 'Odineze', 'Sofas', 'Odineze', 4, 'Описание на продукта...'),
      new Product('Olivenza', 'Olivenza', 'Sofas', 'Olivenza', 5, 'Описание на продукта...'),
      new Product('Palensia', 'Palensia', 'Sofas', 'Palensia', 2, 'Описание на продукта...'),
      new Product('Porto Venere', 'Porto Venere', 'Sofas', 'Porto-Venere', 3, 'Описание на продукта...'),
      new Product('Saragosa', 'Saragosa', 'Sofas', 'Saragosa', 4, 'Описание на продукта...'),
      new Product('Simone', 'Simone', 'Sofas', 'Simone', 5, 'Описание на продукта...'),
      new Product('Sunset', 'Sunset', 'Sofas', 'Sunset', 6, 'Описание на продукта...'),
      new Product('Texas', 'Texas', 'Sofas', 'Texas', 8, 'Описание на продукта...'),
      new Product('Tiffany', 'Tiffany', 'Sofas', 'Tiffany', 3, 'Описание на продукта...'),
      new Product('Verona', 'Verona', 'Sofas', 'Verona', 4, 'Описание на продукта...'),
      new Product('Vigo Nuovo', 'Vigo Nuovo', 'Sofas', 'Vigo-Nuovo', 2, 'Описание на продукта...'),
      new Product('Vigo', 'Vigo', 'Sofas', 'Vigo', 2, 'Описание на продукта...'),
      new Product('101L', '101L', 'Armchair', '101l', 6, 'Example description...'),
      new Product('506B', '506B', 'Armchair', '506b', 7, 'Example description...'),
      new Product('507T', '507T', 'Armchair', '507t', 5, 'Example description...'),
      new Product('Galaxy', 'Galaxy', 'Armchair', 'galaxy', 6, 'Example description...'),
      new Product('Avezano', 'Avezano', 'Armchair', 'avezano', 6, 'Example description...'),
      new Product('Kiss', 'Kiss', 'Armchair', 'kiss', 4, 'Example description...'),
      new Product('Palacio', 'Palacio', 'Armchair', 'palacio', 4, 'Example description...'),
      new Product('Clio', 'Clio', 'Armchair', 'clio', 7, 'Example description...'),
      new Product('Tokyo', 'Tokyo', 'Armchair', 'tokyo', 4, 'Example description...'),
      new Product('303M', '303M', 'Tables', '303m', 3, 'Example description...'),
      new Product('304M', '304M', 'Tables', '304m', 3, 'Example description...'),
      new Product('405M', '405M', 'Tables', '405m', 4, 'Example description...'),
      new Product('406M', '406M', 'Tables', '406m', 3, 'Example description...'),
      new Product('Aksinia', 'Aksinia', 'Beds', 'aksinia', 4, 'Example description...'),
      new Product('Amore', 'Amore', 'Beds', 'amore', 6, 'Example description...'),
      new Product('Belinda', 'Belinda', 'Beds', 'belinda', 3, 'Example description...'),
      new Product('Izabel', 'Izabel', 'Beds', 'izabel', 4, 'Example description...'),
      new Product('Lotos', 'Lotos', 'Beds', 'lotos', 5, 'Example description...'),
      new Product('Lu', 'Lu', 'Beds', 'lu', 3, 'Example description...'),
      new Product('Lusia', 'Lusia', 'Beds', 'lusia', 3, 'Example description...'),
      new Product('Nikol', 'Nikol', 'Beds', 'nikol', 4, 'Example description...'),
      new Product('Sunrise', 'Sunrise', 'Beds', 'sunrise', 5, 'Example description...'),
      new Product('Bed Aksinia', 'Aksinia', 'Beds', 'aksinia', 4, 'Example description...'),
      new Product('Bed Amore', 'Amore', 'Beds', 'amore', 6, 'Example description...'),
      new Product('Bed Belinda', 'Belinda', 'Beds', 'belinda', 3, 'Example description...'),
      new Product('Bed Izabel', 'Izabel', 'Beds', 'izabel', 4, 'Example description...'),
      new Product('Bed Lotos', 'Lotos', 'Beds', 'lotos', 5, 'Example description...'),
      new Product('Bed Lu', 'Lu', 'Beds', 'lu', 3, 'Example description...'),
      new Product('Bed Lusia', 'Lusia', 'Beds', 'lusia', 3, 'Example description...'),
      new Product('Bed Nikol', 'Nikol', 'Beds', 'nikol', 4, 'Example description...'),
      new Product('Bed Sunrise', 'Sunrise', 'Beds', 'sunrise', 5, 'Example description...'),
      new Product('1306s', '1306s', 'Chairs', '1306s', 4, 'Example description...'),
      new Product('1319s', '1319s', 'Chairs', '1319s', 5, 'Example description...'),
      new Product('1321s', '1321s', 'Chairs', '1321s', 3, 'Example description...'),
      new Product('1327s', '1327s', 'Chairs', '1327s', 4, 'Example description...'),
      new Product('1329s', '1329s', 'Chairs', '1329s', 4, 'Example description...'),
      new Product('1329b', '1329b', 'Chairs', '1329b', 4, 'Example description...')
  ];

    return products
  }
}
