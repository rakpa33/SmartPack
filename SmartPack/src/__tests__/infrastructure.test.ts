import { describe, it, expect } from 'vitest';

describe('Test Infrastructure Verification', () => {
  it('should run basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have access to vitest globals', () => {
    expect(describe).toBeDefined();
    expect(it).toBeDefined();
    expect(expect).toBeDefined();
  });
});
