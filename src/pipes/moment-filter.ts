import { Pipe, PipeTransform, Injectable } from '@angular/core';
import Moment from 'moment';
@Pipe({
  name: 'moment'
})
@Injectable()
export class MomentFilterPipe implements PipeTransform {
  transform(value, args) {
    return Moment.utc(value).local().format(args);
  }
}
