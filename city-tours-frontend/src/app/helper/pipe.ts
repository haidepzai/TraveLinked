import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
   name: 'limitTo',
})
export class TruncatePipe {
   transform(value: string | undefined, args: string): string {
      if (value === undefined) {
         return '';
      }
      // let limit = args.length > 0 ? parseInt(args[0], 10) : 10;
      // let trail = args.length > 1 ? args[1] : '...';
      const limit = args ? parseInt(args, 10) : 10;
      const trail = '...';

      return value.length > limit ? value.substring(0, limit) + trail : value;
   }
}
