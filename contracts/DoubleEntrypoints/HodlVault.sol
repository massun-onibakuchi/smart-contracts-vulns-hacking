// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HodlVault is ERC20 {
    IERC20 public immutable token;

    address public governance;

    uint256 public unlocktimestamp;

    constructor(IERC20 _token, address _governance) ERC20("Hodl", "HODL") {
        token = _token;
        governance = _governance;
    }

    function hold(uint256 amount) external {
        //  5 years
        unlocktimestamp = block.timestamp + 5 * 3600 * 24 * 365;

        token.transferFrom(msg.sender, address(this), amount);
        _mint(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        require(block.timestamp > unlocktimestamp, "lock");

        _burn(msg.sender, amount);
        token.transfer(msg.sender, amount);
    }

    /// @notice rescue tokens accidentally send
    function sweep(IERC20 _token) external {
        require(token != _token, "!token");
        _token.transfer(governance, _token.balanceOf(address(this)));
    }
}
