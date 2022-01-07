// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./Batchable.sol";

contract BankCoin is ERC20("BankCoin", "BANK"), Batchable {
    function deposit() external payable {
        _mint(msg.sender, msg.value);
    }

    function depositTo(address account) external payable {
        _mint(account, msg.value);
    }

    function withdraw(uint256 amount) external {
        _burn(msg.sender, amount);
        Address.sendValue(payable(msg.sender), amount);
    }

    function withdrawFrom(address account, uint256 amount) external {
        uint256 currentAllowance = allowance(account, msg.sender);
        require(currentAllowance >= amount, "ERC20: withdraw amount exceeds allowance");
        unchecked {
            _approve(account, msg.sender, currentAllowance - amount);
        }
        _burn(account, amount);
        Address.sendValue(payable(msg.sender), amount);
    }
}
