// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.4;

import "./Batchable.sol";

contract DutchAuction is Batchable {
    /**
     * @notice Checks the amount of ETH to commit and adds the commitment. Refunds the buyer if commit is too high.
     * @param _beneficiary Auction participant ETH address.
     */
    function commitEth(address payable _beneficiary, bool readAndAgreedToMarketParticipationAgreement)
        external
        payable
    {
        // require(paymentCurrency == ETH_ADDRESS, "DutchAuction: payment currency is not ETH address");
        // if (readAndAgreedToMarketParticipationAgreement == false) {
        //     revertBecauseUserDidNotProvideAgreement();
        // }
        // // Get ETH able to be committed
        // uint256 ethToTransfer = calculateCommitment(msg.value);
        // /// @notice Accept ETH Payments.
        // uint256 ethToRefund = msg.value.sub(ethToTransfer);
        // if (ethToTransfer > 0) {
        //     _addCommitment(_beneficiary, ethToTransfer);
        // }
        // /// @notice Return any ETH to be refunded.
        // if (ethToRefund > 0) {
        //     _beneficiary.transfer(ethToRefund);
        // }
    }

    function priceFunction() external view returns (uint256) {}

    function getTotalTokens() external view returns (uint256) {}

    function calculateCommitment(uint256 amount) external view returns (uint256) {}

    function isOpen() external view returns (bool) {}
}
