import {
  TestBed,
  async
} from '@angular/core/testing';
import {
  MainChartContainer
} from './app.main-chart-container';

describe('MainChartContainer', () => {
  beforeEach(async (() => {
    TestBed.configureTestingModule({
      declarations: [
        MainChartContainer
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(MainChartContainer);
    fixture.detectChanges();
    this.app = fixture.debugElement.componentInstance;
    this.app.ngOnInit();
    this.compiled = fixture.debugElement.nativeElement;
  }));
  it('should create the app', async (() => {
    expect(this.app).toBeTruthy();
  }));
  it('should render the svg tag with id', async (() => {
    expect(this.compiled.querySelector('svg').id).toBe('chart');
  }));
  it('should render the svg tag with correct sizes', async (() => {
    expect(this.compiled.querySelector('svg').viewBox.baseVal.width).toBe(960);
    expect(this.compiled.querySelector('svg').viewBox.baseVal.height).toBe(500);
  }));
  it('should render the 4 groups inside the svg', async (() => {
    expect(this.compiled.getElementsByTagName('g').length).toBe(4);
  }));
});
