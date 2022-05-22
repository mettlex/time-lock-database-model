import { Block, PaginatedBlocks } from "./block.ts";

export abstract class Chain<DataType> {
  abstract get firstBlock(): Block<DataType> | Promise<Block<DataType>>;

  abstract get lastBlock(): Block<DataType> | Promise<Block<DataType>>;

  abstract getBlocks(
    startHash?: string, // firstBlock.hash if undefined
    endHash?: string, // lastBlock.hash if undefined
    limit?: number,
  ): PaginatedBlocks<DataType> | Promise<PaginatedBlocks<DataType>>;

  abstract addBlock(block: Block<DataType>): void | Promise<void>;

  abstract getBlock(
    hash: string,
  ): (Block<DataType> | null) | Promise<Block<DataType> | null>;

  abstract commitBlock(hash: string): boolean | Promise<boolean>;
}
