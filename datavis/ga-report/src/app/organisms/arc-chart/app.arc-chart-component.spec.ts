import {
  TestBed,
  async
} from '@angular/core/testing';
import {
  ArcChartComponent
} from './app.arc-chart-component';

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

describe('ArcChartComponent', () => {
  beforeEach(async (() => {
    TestBed.configureTestingModule({
      declarations: [
        ArcChartComponent
      ],
    }).compileComponents();
  }));
  it('should create the app', async (() => {
    const fixture = TestBed.createComponent(ArcChartComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it('should render the grid', async (() => {
    const fixture = TestBed.createComponent(ArcChartComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    app.renderChart(TEST_DATA);
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.getElementsByClassName('grid').length).toBe(1);
  }));
  it('should render the arcs', async (() => {
    const fixture = TestBed.createComponent(ArcChartComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    app.renderChart(TEST_DATA);
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.getElementsByClassName('arcs').length).toBe(2);
  }));
  it('should render the right amount of arcs', async (() => {
    const fixture = TestBed.createComponent(ArcChartComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    app.renderChart(TEST_DATA);
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.getElementsByTagName('path').length).toBe(10);
  }));
  it('should render the labels', async (() => {
    const fixture = TestBed.createComponent(ArcChartComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    app.renderChart(TEST_DATA);
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.getElementsByClassName('labels').length).toBe(2);
  }));
});
