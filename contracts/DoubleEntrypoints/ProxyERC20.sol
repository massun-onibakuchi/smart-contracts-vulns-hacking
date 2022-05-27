// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Synthetix-like proxy Implementaion
/// @dev
/// ref: SNX https://etherscan.io/address/0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f#code
/// XXX
///  - updated solidity version pragma
///  - `Owned` contract is replaced with Openzeppelin's `Ownable`
///  - updated some of assembly

/**
 * @notice
 * A proxy contract that, if it does not recognise the function
 * being called on it, passes all value and call data to an
 * underlying target contract.
 *
 * This proxy has the capacity to toggle between DELEGATECALL
 * and CALL style proxy functionality.
 *
 * The former executes in the proxy's context, and so will preserve
 * msg.sender and store data at the proxy address. The latter will not.
 * Therefore, any contract the proxy wraps in the CALL style must
 * implement the Proxyable interface, in order that it can pass msg.sender
 * into the underlying contract as the state parameter, messageSender.
 **/

interface Proxyable is IERC20Metadata {
    function proxy() external view returns (Proxy);

    function setProxy(address payable _proxy) external;

    function setMessageSender(address sender) external;
}

contract Proxy is Ownable {
    Proxyable public target;
    bool public useDELEGATECALL;

    event TargetUpdated(Proxyable newTarget);

    function setTarget(Proxyable _target) external onlyOwner {
        target = _target;
        emit TargetUpdated(_target);
    }

    function setUseDELEGATECALL(bool value) external onlyOwner {
        useDELEGATECALL = value;
    }

    fallback() external payable {
        if (useDELEGATECALL) {
            assembly {
                /* Copy call data into free memory region. */
                let free_ptr := mload(0x40)
                calldatacopy(free_ptr, 0, calldatasize())

                /* Forward all gas and call data to the target contract. */
                let result := delegatecall(gas(), sload(target.slot), free_ptr, calldatasize(), 0, 0)
                returndatacopy(free_ptr, 0, returndatasize())

                /* Revert if the call failed, otherwise return the result. */
                if iszero(result) {
                    revert(free_ptr, returndatasize())
                }
                return(free_ptr, returndatasize())
            }
        } else {
            /* Here we are as above, but must send the messageSender explicitly
             * since we are using CALL rather than DELEGATECALL. */
            target.setMessageSender(msg.sender);
            assembly {
                let free_ptr := mload(0x40)
                calldatacopy(free_ptr, 0, calldatasize())

                /* We must explicitly forward ether to the underlying contract as well. */
                let result := call(gas(), sload(target.slot), callvalue(), free_ptr, calldatasize(), 0, 0)
                returndatacopy(free_ptr, 0, returndatasize())

                if iszero(result) {
                    revert(free_ptr, returndatasize())
                }
                return(free_ptr, returndatasize())
            }
        }
    }
}

/**
 * @notice Synthetix-like proxy Implementaion with explicit ERC20 standard
 **/
contract ProxyERC20 is Proxy, IERC20Metadata {
    // ------------- ERC20 Details ------------- //

    function name() public view override returns (string memory) {
        // Immutable static call from target contract
        return target.name();
    }

    function symbol() public view override returns (string memory) {
        // Immutable static call from target contract
        return target.symbol();
    }

    function decimals() public view override returns (uint8) {
        // Immutable static c   all from target contract
        return target.decimals();
    }

    // ------------- ERC20 Interface ------------- //

    /**
     * @dev Total number of tokens in existence
     */
    function totalSupply() public view override returns (uint256) {
        // Immutable static call from target contract
        return target.totalSupply();
    }

    /**
     * @dev Gets the balance of the specified address.
     * @param owner The address to query the balance of.
     * @return An uint256 representing the amount owned by the passed address.
     */
    function balanceOf(address owner) public view override returns (uint256) {
        // Immutable static call from target contract
        return target.balanceOf(owner);
    }

    /**
     * @dev Function to check the amount of tokens that an owner allowed to a spender.
     * @param owner address The address which owns the funds.
     * @param spender address The address which will spend the funds.
     * @return A uint256 specifying the amount of tokens still available for the spender.
     */
    function allowance(address owner, address spender) public view override returns (uint256) {
        // Immutable static call from target contract
        return target.allowance(owner, spender);
    }

    /**
     * @dev Transfer token for a specified address
     * @param to The address to transfer to.
     * @param value The amount to be transferred.
     */
    function transfer(address to, uint256 value) public override returns (bool) {
        // Mutable state call requires the proxy to tell the target who the msg.sender is.
        target.setMessageSender(msg.sender);

        // Forward the ERC20 call to the target contract
        target.transfer(to, value);

        return true;
    }

    /**
     * @dev Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
     * Beware that changing an allowance with this method brings the risk that someone may use both the old
     * and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this
     * race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     * @param spender The address which will spend the funds.
     * @param value The amount of tokens to be spent.
     */
    function approve(address spender, uint256 value) public override returns (bool) {
        // Mutable state call requires the proxy to tell the target who the msg.sender is.
        target.setMessageSender(msg.sender);

        // Forward the ERC20 call to the target contract
        target.approve(spender, value);

        return true;
    }

    /**
     * @dev Transfer tokens from one address to another
     * @param from address The address which you want to send tokens from
     * @param to address The address which you want to transfer to
     * @param value uint256 the amount of tokens to be transferred
     */
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public override returns (bool) {
        // Mutable state call requires the proxy to tell the target who the msg.sender is.
        target.setMessageSender(msg.sender);

        // Forward the ERC20 call to the target contract
        target.transferFrom(from, to, value);

        return true;
    }
}
