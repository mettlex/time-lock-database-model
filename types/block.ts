export abstract class Block<DataType> {
  constructor(
    public previousHash: string | null,
    public data: DataType,
    public nonce: string,
    public hash: string,
    public status: "prepared" | "committed",
    public timestamp: number,
  ) {}
}

export interface PaginatedBlocks<DataType> {
  results: Block<DataType>[];
  nextHash: string | null;
}
