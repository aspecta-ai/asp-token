// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { OFT } from "@layerzerolabs/oft-evm/contracts/OFT.sol";

contract AspToken is OFT {
    constructor(
        address _lzEndpoint,
        address _delegate,
        address _treasury,
        uint256 _initialSupply
    ) OFT("ASPECTA", "ASP", _lzEndpoint, _delegate) Ownable(_delegate) {
        _mint(_treasury, _initialSupply);
    }
}
