import {
  BrowserModule
} from '@angular/platform-browser';
import {
  NgModule,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import {
  BarChartComponent
} from './organisms/bar-chart/app.bar-chart-component';
import {
  ArcChartComponent
} from './organisms/arc-chart/app.arc-chart-component';
import {
  LineChartComponent
} from './organisms/line-chart/app.line-chart-component';
import {
  SegmentContainerComponent
} from './organisms/segment-container/app.segment-container-component';
import {
  MainChartContainer
} from './templates/app.main-chart-container';


@NgModule({
  declarations: [
    MainChartContainer,
    BarChartComponent,
    ArcChartComponent,
    LineChartComponent,
    SegmentContainerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [
    MainChartContainer
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {}
