import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';


const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments } = hre;
    console.log('Deploy ETH Modules,Gas used:', deployments.getGasUsed());
};
export default func;
func.tags = ['eth_modules'];
func.dependencies = ['ETHPegToken','ETHVaultBuffer','Harvester','ETHStrategies'];
