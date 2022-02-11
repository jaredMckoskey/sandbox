#!/usr/bin/env node

import { createHmac } from "crypto";

const start = () => {

    let maxMemory = 10000000;
    let blockNumber = 2;
    let blockTransactions = `Blue->Green->25
                             Red->Yellow->500`;
    let previousHash = "62df1624b8a1586dd867c9d62b619a4891c7caf9811464e72d937e760585052a";
    let difficulty = "000000";
    let nonce = 0;
    let blockString = blockNumber + blockTransactions + previousHash;
    const timeNow = new Date();

    for (nonce; nonce < maxMemory; nonce++) {
        let hash = createHmac("sha256", blockString + nonce).digest("hex");

        if (hash.startsWith(difficulty)) {
            console.log(`Block #${blockNumber} mined successfully after ${nonce} attempts in ${(new Date() - timeNow) / 1000} seconds`);
            console.log(`Final hash: ${hash}`);
            break;
        }
    }

    if (nonce === maxMemory) {
        throw `nonce not found after ${maxMemory} attempts in ${(new Date() - timeNow) / 1000} Seconds`;
    }
};

start();
