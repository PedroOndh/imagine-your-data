import {
  TestBed,
  async
} from '@angular/core/testing';
import {
  parseDataForMetric
} from './dataFormatter';

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

describe('parseDataForMetric', () => {
  it('should return undefined when data is empty', async (() => {
    const result = parseDataForMetric([], '');
    expect(result).toBeUndefined();
  }));
  it('should return undefined when data is in unexpected format', async (() => {
    const result = parseDataForMetric([{
      bla: 'fu'
    }], '');
    expect(result).toBeUndefined();
  }));
  it('should return formatted data when data is in expected format', async (() => {
    const result = parseDataForMetric(TEST_DATA, 'visits');
    expect(result.segments).toEqual([
      'Desktop',
      'Mobile'
    ]);
    expect(result.keys).toEqual([
      'with',
      'without'
    ]);
    expect(result.maxValue).toBe(350);
    expect(result.stackedData.length).toBe(2);
  }));
});
