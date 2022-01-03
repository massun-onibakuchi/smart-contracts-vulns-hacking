// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WETH is ERC20("Wrapped ETH", "WETH") {
    event Deposit(address indexed dst, uint256 wad);
    event Withdrawal(address indexed src, uint256 wad);

    receive() external payable {}

    function deposit() public payable {
        _mint(msg.sender, msg.value);
        // balanceOf[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 wad) public {
        require(balanceOf(msg.sender) >= wad, "WTM: not enough balance");
        _burn(msg.sender, wad);
        (bool success, ) = msg.sender.call{ value: wad }("");
        require(success, "weth/transfer-eth-failed");
        emit Withdrawal(msg.sender, wad);
    }
}
