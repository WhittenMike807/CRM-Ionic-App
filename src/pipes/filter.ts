/*
 * Example use
 *  <ul>
 *     <li *ngFor="let item of _items | filterPipe:{ label: filterText, description: filterText } : false">{{ item.value }} - {{ item.label }} - {{ item.description }}</li>
 *  </ul>
 */
import { Pipe, PipeTransform, Injectable } from '@angular/core';
@Pipe({
  name: 'filterPipe'
})
@Injectable()
export class FilterPipe implements PipeTransform {
  transform(items: any, filter: any, isAnd: boolean): any {
    if (filter && Array.isArray(items)) {
      let filterKeys = Object.keys(filter);
      if (isAnd) {
        return items.filter(item => {
          // console.log(filterKeys);
          filterKeys.reduce((memo, keyName) =>
            (memo && new RegExp(filter[keyName], 'gi').test(item[keyName])) || filter[keyName] === "", true)
        }
        );
      } else {
        return items.filter(item => {
          return filterKeys.some((keyName) => {
            // console.log(keyName);
            return new RegExp(filter[keyName], 'gi').test(item[keyName]) || filter[keyName] === "";
          });
        });
      }
    } else {
      return items;
    }
  }
}