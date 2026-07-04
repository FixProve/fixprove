export interface Base {
  baseMethod(): void;
}
export interface Derived extends Base {
  derivedMethod(): string;
}
