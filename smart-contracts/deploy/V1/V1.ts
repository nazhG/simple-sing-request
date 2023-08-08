import { HardhatRuntimeEnvironment } from "hardhat/types";;
import { DeployFunction } from "hardhat-deploy/types";
import fs from "node:fs";

/// TODO: dont use a file, set up a DB
// Get the last line of the file "deployments.json"
const lastLine = fs.readFileSync("deployments.txt", "utf-8").split("\n").pop();
// Parse the last line as JSON
const lastDeployment = lastLine ? JSON.parse(lastLine) : { name: "V1", address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" };
console.log("Last deployment: ", lastDeployment);


const contractName = lastDeployment.name;

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, ethers } = hre;
    const { diamond } = deployments;
    const address = (await ethers.getSigners())[0].address;

    await diamond.deploy(contractName, {
        from: address,
        facets: ["V1", "VersionManager"],
        log: true,
        execute: {
            methodName: "setVersion",
            args: ["V1"],
        },
        gasLimit: 10000000,
    });

};

export default func;
func.id = contractName;
func.tags = [contractName];
