import { Coordinator } from "../../types/coordinator.ts";
import { Block } from "../../types/block.ts";
import { TimeLockChain } from "./tlchain.ts";
import { TimeLockDataType, TLBlock } from "../../types/timelock.ts";

const tlChains: TimeLockChain[] = [
  new TimeLockChain(),
  new TimeLockChain(),
  new TimeLockChain(),
];

class TLCoordinator extends Coordinator<TimeLockDataType> {
  chains = tlChains;

  async prepare(data: TimeLockDataType): Promise<boolean> {
    const ts = Date.now();

    // create nonce
    const array = new Uint8Array(10);
    const randomArray = crypto.getRandomValues(array);
    const randomNumberArray = Array.from(randomArray);
    const nonce = randomNumberArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // create hash
    const encoder = new TextEncoder();
    const content = encoder.encode(nonce + JSON.stringify(this));
    const hashBuffer = await crypto.subtle.digest("SHA-512", content);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    for (const chain of this.chains) {
      const block = new TLBlock(null, data, nonce, hash, "prepared", ts);
      chain.addBlock(block);
    }

    return true;
  }

  commit(hash: string): boolean {
    for (const chain of this.chains) {
      const result = chain.commitBlock(hash);

      if (!result) {
        return false;
      }
    }

    return true;
  }

  verify(hash: string, data: Partial<Block<TimeLockDataType>>): boolean {
    // unimplemented
    return true;
  }
}

const coordinator = new TLCoordinator();

console.log(
  // unimplemented
  await coordinator.prepare({
    randomBytesDigest: "",
    firstSecretKeyDigest: "",
    durationInSeconds: 0,
    encryptedSecondKey: "",
  }),
);

console.log(coordinator.chains.map((c) => c.toString())[0]);

const hash = coordinator.chains[0].lastBlock.hash;

console.log(coordinator.commit(hash));

console.log(coordinator.chains.map((c) => c.toString())[0]);
