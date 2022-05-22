import { PaginatedBlocks } from "../../types/block.ts";
import { Chain } from "../../types/chain.ts";
import { TimeLockDataType, TLBlock } from "../../types/timelock.ts";

export class TimeLockChain extends Chain<TimeLockDataType> {
  private tlBlocks: TLBlock[];

  constructor() {
    super();
    this.tlBlocks = [];
  }

  get firstBlock(): TLBlock {
    return this.tlBlocks[0];
  }

  get lastBlock(): TLBlock {
    return this.tlBlocks[this.tlBlocks.length - 1];
  }

  addBlock(block: TLBlock): void {
    this.tlBlocks = [...this.tlBlocks, block];
  }

  getBlock(hash: string): TLBlock | null {
    return this.tlBlocks.find(async (block) => block.hash === hash) || null;
  }

  commitBlock(hash: string): boolean {
    const block = this.tlBlocks.find(async (block) => block.hash === hash);

    if (block) {
      const i = this.tlBlocks.findIndex(async (block) => block.hash === hash);

      this.tlBlocks[i].status = "committed";

      return true;
    }

    return false;
  }

  async getBlocks(
    startHash?: string,
    endHash?: string,
    limit?: number,
  ): Promise<PaginatedBlocks<TimeLockDataType>> {
    const paginatedBlocks: PaginatedBlocks<TimeLockDataType> = {
      results: [],
      nextHash: null,
    };

    let startFound = false;

    let i = 0;

    for (const block of this.tlBlocks) {
      if (startHash === block.hash) {
        startFound = true;
      }

      if (startHash && !startFound) {
        continue;
      }

      paginatedBlocks.results.push(block);

      if (limit && paginatedBlocks.results.length === limit) {
        paginatedBlocks.nextHash = null;
        break;
      }

      if (endHash === block.hash) {
        paginatedBlocks.nextHash = null;
        break;
      }

      if (this.tlBlocks[i + 1]) {
        paginatedBlocks.nextHash = this.tlBlocks[i + 1].hash;
      }

      i++;
    }

    return paginatedBlocks;
  }

  public toString() {
    return JSON.stringify(this.tlBlocks);
  }
}
