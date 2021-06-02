import {
  TestBed,
  async
} from '@angular/core/testing';
import {
  SegmentContainerComponent
} from './app.segment-container-component';

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

describe('SegmentContainerComponent', () => {
  beforeEach(async (() => {
    TestBed.configureTestingModule({
      declarations: [
        SegmentContainerComponent
      ],
    }).compileComponents();
  }));
  it('should create the app', async (() => {
    const fixture = TestBed.createComponent(SegmentContainerComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it('should render header', async (() => {
    const fixture = TestBed.createComponent(SegmentContainerComponent);
    const app = fixture.debugElement.componentInstance;
    app.renderContainer(TEST_DATA);
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.getElementsByClassName('header').length).toBe(1);
  }));
  it('should render segement strings', async (() => {
    const fixture = TestBed.createComponent(SegmentContainerComponent);
    const app = fixture.debugElement.componentInstance;
    app.renderContainer(TEST_DATA);
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.getElementsByClassName('segments').length).toBe(2);
  }));
});
