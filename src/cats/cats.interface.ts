export interface Cat {
  readonly name: string;
  readonly age: number;
  readonly breed: string;
}

export interface ResponseStructure<Data> {
  readonly result: 0 | 1;
  data: Data;
}
