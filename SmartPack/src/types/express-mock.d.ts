// src/types/express-mock.d.ts

// Custom type declarations for express mocks in tests
declare namespace jest {
  interface Mock<T = unknown, Y extends unknown[] = unknown[]> {
    mockReturnValue(value: T): this;
    mockResolvedValue(value: T): this;
    mockRejectedValue(value: T): this;
    mockImplementation(fn: (...args: Y) => T): this;
    mockImplementationOnce(fn: (...args: Y) => T): this;
    mockReturnValueOnce(value: T): this;
    mockResolvedValueOnce(value: T): this;
    mockRejectedValueOnce(value: T): this;
  }
}
