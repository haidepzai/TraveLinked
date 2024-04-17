import { Pipe, PipeTransform } from '@angular/core';
import { Tour } from '../models/tour.model';

@Pipe({
   name: 'search',
})
export class SearchPipe implements PipeTransform {
   transform(tours: Tour[], searchTerm: string): Tour[] {
      if (!tours || !searchTerm) {
         return tours;
      }

      return tours.filter((tour) => tour.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
   }
}
