import { HardhatRuntimeEnvironment } from "hardhat/types";;
import { DeployFunction } from "hardhat-deploy/types";

const contractName = "test"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, ethers } = hre;
    const { diamond } = deployments;
    const address = (await ethers.getSigners())[0].address;

    await diamond.deploy(contractName, {
        from: address,
        facets: ["V2", "VersionManager"],
        log: true,
        execute: {
            methodName: "setVersion",
            args: ["V2"],
        },
    });

};

export default func;
func.id = contractName;
func.tags = [contractName];
