// import { ethers } from 'ethers'
// import { task } from 'hardhat/config'
// import 'dotenv/config'

// import { createGetHreByEid, createProviderFactory } from '@layerzerolabs/devtools-evm-hardhat'
// import { Options } from '@layerzerolabs/lz-v2-utilities'

// interface SendParam {
//     dstEid: EndpointId; // Destination endpoint ID, represented as a number.
//     to: BytesLike; // Recipient address, represented as bytes.
//     amountLD: BigNumberish; // Amount to send in local decimals.
//     minAmountLD: BigNumberish; // Minimum amount to send in local decimals.
//     extraOptions: BytesLike; // Additional options supplied by the caller to be used in the LayerZero message.
//     composeMsg: BytesLike; // The composed message for the send() operation.
//     oftCmd: BytesLike; // The OFT command to be executed, unused in default OFT implementations.
// }

// // send tokens from a contract on one network to another
// task('lz:oft:send', 'Send tokens cross-chain using LayerZero technology')
//     .addParam('contract', 'contract address on network A')
//     .addParam('to', 'recipient address on network B')
//     .addParam('srcEid', 'name of the network A')
//     .addParam('dstEid', 'name of the network B')
//     .addParam('amount', 'amount to transfer in eth')
//     .setAction(async (taskArgs, hre) => {
//         const eidA = taskArgs.srcEid
//         const eidB = taskArgs.dstEid
//         const contractA = taskArgs.contract
//         const recipientB = taskArgs.to
//         // Use 'https://bsc-testnet-rpc.publicnode.com' as the provider URL for BSC Testnet
//         const provider = new ethers.providers.JsonRpcProvider('https://bsc-testnet-rpc.publicnode.com')
//         const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

//         const oftContractFactory = await hre.ethers.getContractFactory('AspToken', wallet)
//         const oft = oftContractFactory.attach(contractA)

//         const decimals = await oft.decimals()
//         const amount = hre.ethers.utils.parseUnits(taskArgs.amount, decimals)
//         let options = Options.newOptions().addExecutorLzReceiveOption(65000, 0).toBytes();
//         const recipientAddressBytes32 = hre.ethers.utils.hexZeroPad(recipientB, 32)


//         const sendParam: SendParam = {
//             dstEid: eidB,
//             to: recipientAddressBytes32,
//             amountLD: amount,
//             minAmountLD: amount,
//             extraOptions: options,
//             composeMsg: ethers.utils.arrayify('0x'), // Assuming no composed message
//             oftCmd: ethers.utils.arrayify('0x'), // Assuming no OFT command is needed
//         };
//         // Get the quote for the send operation
//         const feeQuote = await oft.quoteSend(sendParam, false);
//         const nativeFee = feeQuote.nativeFee;

//         // Sending the tokens with increased gas price
//         try {
//             const tx = await oft.send(sendParam, { nativeFee: nativeFee, lzTokenFee: 0 }, wallet.address, {
//                 value: nativeFee,
//             })
//             console.log('Transaction hash:', tx.hash)
//             await tx.wait()
//             console.log(
//                 `Tokens sent successfully to the recipient on the destination chain. View on LayerZero Scan: https://layerzeroscan.com/tx/${tx.hash}`
//             )
//         } catch (error) {
//             console.error('Error sending tokens:', error)
//         }
//     })


import './common/config.get'
import './common/wire'
import './common/sendOFT'
import './solana/initConfig'
import './solana/createOFT'
import './solana/createOFTAdapter'
import './solana/debug'
import './solana/getRateLimits'
import './solana/retryPayload'
import './solana/setAuthority'
import './solana/updateMetadata'
import './solana/setUpdateAuthority'
import './solana/getPrioFees'
import './solana/base58'
import './solana/setInboundRateLimit'
import './solana/setOutboundRateLimit'

