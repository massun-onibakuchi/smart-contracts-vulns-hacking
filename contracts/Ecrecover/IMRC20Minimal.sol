// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title Polygon network : native token minimal interface
/// @notice The MATIC token is the main token of the Polygon ecosystem.
///  The one of the difference between Ether and MATIC is its standard.
///  It is the native gas-paying asset of the Polygon network,
///  but it is also a contract deployed on Polygon. This contract is the MRC20 contract.
///  The MRC20 standard is used mainly for the possibility of transferring MATIC gaslessly.
///  Gasless MATIC transfers are facilitated by the transferWithSig() function.
interface IMRC20Minimal is IERC20 {
    event Deposit(address indexed token, address indexed from, uint256 amount, uint256 input1, uint256 output1);

    event Withdraw(address indexed token, address indexed from, uint256 amount, uint256 input1, uint256 output1);

    event LogTransfer(
        address indexed token,
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 input1,
        uint256 input2,
        uint256 output1,
        uint256 output2
    );

    function transferWithSig(
        bytes calldata sig,
        uint256 amount,
        bytes32 data,
        uint256 expiration,
        address to
    ) external returns (address from);

    function deposit(address user, uint256 amount) external;

    function withdraw(uint256 amount) external payable;

    // solhint-disable func-name-mixedcase
    function CHAINID() external view returns (uint256);
}
