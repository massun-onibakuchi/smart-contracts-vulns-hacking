import { ethers } from 'hardhat';
import { expect } from "chai";
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

describe("Lack of chainID validation allows signatures to be re-used across forks", async function () {
    let wallets: SignerWithAddress[]
    let vulnerableToken;
    before(async function () {
        wallets = await ethers.getSigners()
    })
    beforeEach(async function () {
        const ERC20Permit = await ethers.getContractFactory('contracts/ReusedSignature/ERC20Permit.sol:ERC20Permit')
        vulnerableToken = await ERC20Permit.deploy("Token0", "TOKEN0");
    });

    describe("Fork after deployment", async function () { });
});
