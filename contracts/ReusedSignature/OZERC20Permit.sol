// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract OZERC20Permit is ERC20Permit {
    constructor(string memory name, string memory symbol) ERC20Permit(name) ERC20("OZ-ERC20Permit", "OZ-ERC20") {}
}
