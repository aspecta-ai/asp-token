import { EndpointId } from '@layerzerolabs/lz-definitions'
import { ExecutorOptionType } from '@layerzerolabs/lz-v2-utilities'
import { TwoWayConfig, generateConnectionsConfig } from '@layerzerolabs/metadata-tools'
import { OAppEnforcedOption } from '@layerzerolabs/toolbox-hardhat'

import type { OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'

import { getOftStoreAddress } from './tasks/solana'

const bscContract: OmniPointHardhat = {
    eid: EndpointId.BSC_V2_MAINNET,
    contractName: 'AspToken',
}

const ethContract: OmniPointHardhat = {
    eid: EndpointId.ETHEREUM_V2_MAINNET,
    contractName: 'AspToken',
}

const baseContract: OmniPointHardhat = {
    eid: EndpointId.BASE_V2_MAINNET,
    contractName: 'AspToken',
}

const solanaContract: OmniPointHardhat = {
    eid: EndpointId.SOLANA_V2_MAINNET,
    address: getOftStoreAddress(EndpointId.SOLANA_V2_MAINNET),
}

// To connect all the above chains to each other, we need the following pathways:
// Optimism <-> Avalanche
// Optimism <-> Arbitrum
// Avalanche <-> Arbitrum

// For this example's simplicity, we will use the same enforced options values for sending to all chains
// For production, you should ensure `gas` is set to the correct value through profiling the gas usage of calling OFT._lzReceive(...) on the destination chain
// To learn more, read https://docs.layerzero.network/v2/concepts/applications/oapp-standard#execution-options-and-enforced-settings
const EVM_ENFORCED_OPTIONS: OAppEnforcedOption[] = [
    {
        msgType: 1,
        optionType: ExecutorOptionType.LZ_RECEIVE,
        gas: 60000,
        value: 0,
    },
]

const SOLANA_ENFORCED_OPTIONS: OAppEnforcedOption[] = [
    {
        msgType: 1,
        optionType: ExecutorOptionType.LZ_RECEIVE,
        gas: 200000,
        value: 2500000,
    },
]

// With the config generator, pathways declared are automatically bidirectional
// i.e. if you declare A,B there's no need to declare B,A
const pathways: TwoWayConfig[] = [
    [
        bscContract, // Chain A contract
        baseContract, // Chain B contract
        [['LayerZero Labs', 'Google'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
        [15, 15], // [A to B confirmations, B to A confirmations]
        [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
    ],
    [
        bscContract, // Chain A contract
        ethContract, // Chain B contract
        [['LayerZero Labs', 'Google'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
        [15, 15], // [A to B confirmations, B to A confirmations]
        [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
    ],
    [
        ethContract, // Chain A contract
        baseContract, // Chain B contract
        [['LayerZero Labs', 'Google'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
        [15, 15], // [A to B confirmations, B to A confirmations]
        [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
    ],
    [
        bscContract, // Chain A contract
        solanaContract, // Chain D contract
        [['LayerZero Labs', 'Google'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
        [32, 32], // [A to D confirmations, D to A confirmations]
        [SOLANA_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain D enforcedOptions, Chain A enforcedOptions
    ],
    [
        baseContract,
        solanaContract,
        [['LayerZero Labs', 'Google'], []],
        [32, 32],
        [SOLANA_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS],

    ],
    [
        ethContract,
        solanaContract,
        [['LayerZero Labs', 'Google'], []],
        [32, 32],
        [SOLANA_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS],
    ],
]

export default async function () {
    // Generate the connections config based on the pathways
    const connections = await generateConnectionsConfig(pathways)
    return {
        contracts: [{ contract: bscContract }, { contract: baseContract }, { contract: ethContract }, { contract: solanaContract }],
        connections,
    }
}
