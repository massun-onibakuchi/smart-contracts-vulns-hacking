// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract EvaluationOrderTrick {
    IERC20 public token;
    address public admin;
    address public preAdmin;
    address public keeper;

    uint256 timestampCoolingEnd;
    uint256 expiracy;

    event ChangeAdmin(address indexed oldAdmin, address indexed newAdmin);

    event PrepareChangingAdmin(address indexed admin);

    event ChangeKeeper(address indexed oldKeeper, address indexed newKeeper);

    constructor(IERC20 _token) {
        token = _token;
        admin = msg.sender;
        keeper = msg.sender;
    }

    function prepareChangingAdmin(address _newAdmin) public {
        require(timestampCoolingEnd <= block.timestamp, "cooling-period");

        timestampCoolingEnd = block.timestamp + 5 days;
        expiracy = block.timestamp + 3 days;
        preAdmin = _newAdmin;

        emit PrepareChangingAdmin(_newAdmin);

        require(admin == msg.sender, _reset());
    }

    function claimAdmin() public {
        require(preAdmin == msg.sender, "only-assigned-admin");
        require(expiracy >= block.timestamp, "expired");

        address oldAdmin = admin;
        admin = preAdmin;
        delete expiracy;
        delete preAdmin;

        emit ChangeAdmin(oldAdmin, preAdmin);
    }

    function _reset() internal returns (string memory) {
        delete preAdmin;
        return "only-admin";
    }

    function changeKeeper(address newKeeper) public {
        require(keeper == msg.sender, "only-keeper");
        emit ChangeKeeper(_resetKeeper(), _setKeeper(newKeeper));
    }

    function _resetKeeper() internal returns (address) {
        address oldKeeper = keeper;
        delete keeper;

        return oldKeeper;
    }

    function _setKeeper(address _newKeeper) internal returns (address) {
        require(keeper == address(0), "keeper-zero-address");
        require(_newKeeper != address(0), "set-zero-address");

        keeper = _newKeeper;

        return _newKeeper;
    }
}
