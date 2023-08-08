import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
dotenv.config();

console.log(process.env);


const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {

    hardhat: {
      accounts: { mnemonic: process.env.MNEMONIC_TEST },
      forking: {
        url: process.env.MUMBAI_URL || "",
        blockNumber: 38636000,
      },
      deploy: ["deploy/V1"],
      live: false,
    },
    mumbai: {
      url: process.env.MUMBAI_URL,
      accounts: { mnemonic: process.env.MNEMONIC_TEST },
      deploy: ["deploy/V1"],
    },
  },
};

export default config;
