import {
  Component,
  ViewEncapsulation
} from '@angular/core';
import {
  BarChartComponent
} from './../organisms/bar-chart/app.bar-chart-component';
import {
  ArcChartComponent
} from './../organisms/arc-chart/app.arc-chart-component';
import {
  LineChartComponent
} from './../organisms/line-chart/app.line-chart-component';
import {
  SegmentContainerComponent
} from './../organisms/segment-container/app.segment-container-component';
import {
  readCsvFile
} from './../utils/fileReader';
import {
  select
} from 'd3-selection';

@Component({
  selector: 'app-root',
  templateUrl: './app.main-chart-container.html',
  styles: [`
    .header {
      font-size: .9rem;
    }
    .legend {
      font-size: .5rem;
    }
    .labels {
      font-size: .7rem;
    }
    .yoy_labels {
      font-size: .5rem;
    }
  `],
  encapsulation: ViewEncapsulation.None,
})

export class MainChartContainer {

  width = 960;
  height = 500;

  createContainer = () => {
    const svg = select('#chart')
      .attr('viewBox', `0, 0, ${this.width}, ${this.height}`)
      .attr('style', 'width: 100%; height: 50vw;');
  };

  ngOnInit() {
    this.createContainer();

    const barChart = new BarChartComponent;
    const arcChart = new ArcChartComponent;
    const lineChart = new LineChartComponent;
    const segmentContainer = new SegmentContainerComponent;

    readCsvFile('./assets/data.csv', data => {
      segmentContainer.renderContainer(data);
      barChart.renderChart(data);
      arcChart.renderChart(data);
    });
    readCsvFile('./assets/time_series_data.csv', (data) => {
      lineChart.renderChart(data, data.columns);
    });
  }
}
