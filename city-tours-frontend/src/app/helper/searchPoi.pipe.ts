import { Pipe, PipeTransform } from '@angular/core';
import { PointOfInterest } from '../models/poi.model';

@Pipe({
   name: 'searchPoi',
})
export class SearchPipePoi implements PipeTransform {
   transform(pois: PointOfInterest[], searchTerm: string): PointOfInterest[] {
      if (!pois || !searchTerm) {
         return pois;
      }

      return pois.filter((poi) => poi.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
   }
}
