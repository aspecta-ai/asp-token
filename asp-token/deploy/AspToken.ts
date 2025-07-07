import assert from 'assert'

import { type DeployFunction } from 'hardhat-deploy/types'

const contractName = 'AspToken'

const deploy: DeployFunction = async (hre) => {
    const { getNamedAccounts, deployments } = hre

    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    assert(deployer, 'Missing named deployer account')

    console.log(`Network: ${hre.network.name}`)
    console.log(`Deployer: ${deployer}`)

    // This is an external deployment pulled in from @layerzerolabs/lz-evm-sdk-v2
    //
    // @layerzerolabs/toolbox-hardhat takes care of plugging in the external deployments
    // from @layerzerolabs packages based on the configuration in your hardhat config
    //
    // For this to work correctly, your network config must define an eid property
    // set to `EndpointId` as defined in @layerzerolabs/lz-definitions
    //
    // For example:
    //
    // networks: {
    //   fuji: {
    //     ...
    //     eid: EndpointId.AVALANCHE_V2_TESTNET
    //   }
    // }
    const endpointV2Deployment = await hre.deployments.get('EndpointV2')
    // Use a dict to control supply. If hre.network.name is bsc-testnet, initial supply is 1 billion tokens with 18 decimals, if its base-testnet then 100 million tokens with 18 decimals
    const initialSupplies = {
        'bsc-testnet': hre.ethers.utils.parseUnits('1000000000', 18), // 1 billion tokens with 18 decimals
        'base-testnet': hre.ethers.utils.parseUnits('100000000', 18),  // 100 million tokens with 18 decimals
        'bsc-mainnet': hre.ethers.utils.parseUnits('400000000', 18), // 400 million tokens with 18 decimals
        'base-mainnet': hre.ethers.utils.parseUnits('300000000', 18),  // 300 million tokens with 18 decimals
        'ethereum-mainnet': hre.ethers.utils.parseUnits('300000000', 18), // 300 million tokens with 18 decimals
    }
    const initialSupply = initialSupplies[hre.network.name]
    const { address } = await deploy(contractName, {
        from: deployer,
        args: [
            endpointV2Deployment.address, // LayerZero's EndpointV2 address
            deployer, // owner
            '0x3D482d7bC0740F775DCD5fE37B98DC961aEf6d66', // treasury
            initialSupply, // initial supply
        ],
        log: true,
        skipIfAlreadyDeployed: true,
        // deterministicDeployment: true,
        // deterministicSalt: "testsalt"
    })

    console.log(`Deployed contract: ${contractName}, network: ${hre.network.name}, address: ${address}`)
}

deploy.tags = [contractName]

export default deploy
