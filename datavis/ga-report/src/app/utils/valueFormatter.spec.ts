import {
  TestBed,
  async
} from '@angular/core/testing';
import {
  makeMillString,
  makePercentString,
  makeYoyString
} from './valueFormatter';

describe('makeMillString', () => {
  it('should return undefined when data is empty', async (() => {
    const result = makeMillString(undefined);
    expect(result).toBeUndefined();
  }));
  it('should return undefined when data is in unexpected format', async (() => {
    const result = makeMillString('bla');
    expect(result).toBeUndefined();
  }));
  it('should return million string when value is in expected format', async (() => {
    const result = makeMillString(12300000);
    expect(result).toBe('12.3M');
  }));
});

describe('makePercentString', () => {
  it('should return undefined when data is empty', async (() => {
    const result = makePercentString(undefined);
    expect(result).toBeUndefined();
  }));
  it('should return undefined when data is in unexpected format', async (() => {
    const result = makePercentString('bla');
    expect(result).toBeUndefined();
  }));
  it('should return percent string when value is in expected format', async (() => {
    const result = makePercentString(12.123);
    expect(result).toBe('12.1%');
  }));
});

describe('makeYoyString', () => {
  it('should return undefined when data is empty', async (() => {
    const result = makeYoyString(undefined);
    expect(result).toBeUndefined();
  }));
  it('should return undefined when data is in unexpected format', async (() => {
    const result = makeYoyString('bla');
    expect(result).toBeUndefined();
  }));
  it('should return YoY string when value is in positive format', async (() => {
    const result = makeYoyString(12.123);
    expect(result).toBe('▲ 12.1% YoY');
  }));
  it('should return percent string when value is in negative format', async (() => {
    const result = makeYoyString(-12.123);
    expect(result).toBe('▼ -12.1% YoY');
  }));
});
