import { HttpExceptionFilter } from './http-exception.filter';

describe('HttExceptionFilter', () => {
  it('should be defined', () => {
    expect(new HttpExceptionFilter()).toBeDefined();
  });
});
