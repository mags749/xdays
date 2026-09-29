import {getDate} from '../src/utils/date';

describe('getDate', () => {
  it('normalises a date to 06:00:00.000 local time on the same day', () => {
    const input = new Date(2026, 8, 29, 17, 45, 12, 500);
    const result = getDate(input);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(8);
    expect(result.getDate()).toBe(29);
    expect(result.getHours()).toBe(6);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });
});
