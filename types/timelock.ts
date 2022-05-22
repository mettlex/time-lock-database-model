import { Block } from "./block.ts";

export interface TimeLockDataType {
  randomBytesDigest: string; // must be unique hash digest
  firstSecretKeyDigest: string; // only hash digest
  durationInSeconds: number;
  encryptedSecondKey: string; // base64 encoded cipher text
}

export class TLBlock extends Block<TimeLockDataType> {
  constructor(
    previousHash: string | null,
    data: TimeLockDataType,
    nonce: string,
    hash: string,
    status: "prepared" | "committed" = "prepared",
    timestamp: number, // must be decentralized timestamp
  ) {
    super(previousHash, data, nonce, hash, status, timestamp);
  }
}
