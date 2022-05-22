import { Chain } from "./chain.ts";
import { Block } from "./block.ts";

export abstract class Coordinator<DataType> {
  abstract get chains(): Chain<DataType>[];
  abstract prepare(data: DataType): boolean | Promise<boolean>;
  abstract commit(hash: string): boolean | Promise<boolean>;
  abstract verify(
    hash: string,
    data: Partial<Block<DataType>>,
  ): boolean | Promise<boolean>;
}
