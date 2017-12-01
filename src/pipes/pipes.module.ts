import { NgModule } from '@angular/core';
import { MomentFilterPipe } from './moment-filter';
import { FilterPipe } from './filter';
import { OrderByPipe } from './orderBy';
import { GroupByPipe } from './groupBy';

@NgModule({
  declarations: [
    MomentFilterPipe,
    FilterPipe,
    OrderByPipe,
    GroupByPipe
  ],
  imports: [

  ],
  exports: [
    MomentFilterPipe,
    FilterPipe,
    OrderByPipe,
    GroupByPipe
  ]
})
export class PipesModule { }