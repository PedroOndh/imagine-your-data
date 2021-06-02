import {
  TestBed,
  async
} from '@angular/core/testing';
import {
  LineChartComponent
} from './app.line-chart-component';

const TEST_DATA = [{
    segment: 'All',
    no_search_conv_current: 20,
    no_search_conv_prev: 15,
    search_conv_current: 15,
    search_conv_prev: 20,
    week_number: 12
  },
  {
    segment: 'Mobile',
    no_search_conv_current: 20,
    no_search_conv_prev: 15,
    search_conv_current: 15,
    search_conv_prev: 20,
    week_number: 13
  }
];
const TEST_COLUMNS = [
  'no_search_conv_current',
  'no_search_conv_prev',
  'search_conv_current',
  'search_conv_prev'
];

describe('LineChartComponent', () => {
  beforeEach(async (() => {
    TestBed.configureTestingModule({
      declarations: [
        LineChartComponent
      ],
    }).compileComponents();
  }));
  it('should create the app', async (() => {
    const fixture = TestBed.createComponent(LineChartComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it('should render the x axis', async (() => {
    const fixture = TestBed.createComponent(LineChartComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    app.renderChart(TEST_DATA, TEST_COLUMNS);
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.getElementsByClassName('x-axis').length).toBe(1);
  }));
  it('should render the legend', async (() => {
    const fixture = TestBed.createComponent(LineChartComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    app.renderChart(TEST_DATA, TEST_COLUMNS);
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.getElementsByClassName('legend').length).toBe(1);
  }));
  it('should render the lines', async (() => {
    const fixture = TestBed.createComponent(LineChartComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    app.renderChart(TEST_DATA, TEST_COLUMNS);
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.getElementsByClassName('visibleLine').length).toBe(4);
    expect(compiled.getElementsByClassName('hiddenLine').length).toBe(4);
  }));
});
