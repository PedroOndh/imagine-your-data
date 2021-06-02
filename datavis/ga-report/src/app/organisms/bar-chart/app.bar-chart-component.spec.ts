import {
  TestBed,
  async
} from '@angular/core/testing';
import {
  BarChartComponent
} from './app.bar-chart-component';

const TEST_DATA = [{
    device_type: 'Desktop',
    search_type: 'with',
    visits: 100,
    conversion_rate: 10
  },
  {
    device_type: 'Desktop',
    search_type: 'without',
    visits: 250,
    conversion_rate: 25
  },
  {
    device_type: 'Mobile',
    search_type: 'with',
    visits: 10,
    conversion_rate: 1
  },
  {
    device_type: 'Mobile',
    search_type: 'without',
    visits: 25,
    conversion_rate: 2.5
  }
];

describe('BarChartComponent', () => {
  beforeEach(async (() => {
    TestBed.configureTestingModule({
      declarations: [
        BarChartComponent
      ],
    }).compileComponents();
  }));
  it('should create the app', async (() => {
    const fixture = TestBed.createComponent(BarChartComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it('should render the parent group tag', async (() => {
    const fixture = TestBed.createComponent(BarChartComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('g').id).toBe('inner-bar-chart');
  }));
  it('should render the grid', async (() => {
    const fixture = TestBed.createComponent(BarChartComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    app.renderChart(TEST_DATA);
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.getElementsByClassName('grid').length).toBe(1);
  }));
  it('should render the x axis', async (() => {
    const fixture = TestBed.createComponent(BarChartComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    app.renderChart(TEST_DATA);
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.getElementsByClassName('x-axis').length).toBe(1);
  }));
  it('should render the bars', async (() => {
    const fixture = TestBed.createComponent(BarChartComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    app.renderChart(TEST_DATA);
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.getElementsByClassName('bars').length).toBe(1);
  }));
  it('should render the chart bars with expected sizes', async (() => {
    const fixture = TestBed.createComponent(BarChartComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    app.renderChart(TEST_DATA);
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.getElementsByTagName('rect').length).toBe(4);
    expect(compiled.getElementsByTagName('rect')[0].width.baseVal.value).toBeCloseTo(114, 0);
    expect(compiled.getElementsByTagName('rect')[0].height.baseVal.value).toBeCloseTo(95, 0);
  }));
  it('should render the labels', async (() => {
    const fixture = TestBed.createComponent(BarChartComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    app.renderChart(TEST_DATA);
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.getElementsByClassName('labels').length).toBe(1);
  }));
  it('should render all chart labels', async (() => {
    const fixture = TestBed.createComponent(BarChartComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    app.renderChart(TEST_DATA);
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.getElementsByTagName('text').length).toBe(17);
  }));
});
