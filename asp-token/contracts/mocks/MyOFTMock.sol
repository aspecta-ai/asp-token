// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import { AspToken } from "../AspToken.sol";

// @dev WARNING: This is for testing purposes only
contract MyOFTMock is AspToken {
    constructor(
        string memory _name,
        string memory _symbol,
        address _lzEndpoint,
        address _delegate,
        address _treasury,
        uint256 _initialSupply
    ) AspToken(_lzEndpoint, _delegate, _treasury, _initialSupply) {}

    function mint(address _to, uint256 _amount) public {
        _mint(_to, _amount);
    }
}
