import { ethers } from 'hardhat'
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { ProxyERC20, HodlVault } from '../typechain-types'
import { getImpersonatedSigner, resetFork } from './helpers/utils'

const BLOCK_NUMBER = 14850000
const SNX_ProxyERC20 = '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F'
const SNX_Logic = '0x7F30336E0e01bEe8dD1C641bD793400f82d080cf'
const SNX_WHALE = '0xF977814e90dA44bFA03b6295A0616a897441aceC' // binance8

describe('Double Entry-points token', async function () {
  let whale: SignerWithAddress
  let player: SignerWithAddress
  let gov: SignerWithAddress
  let proxy: ProxyERC20

  before(async function () {
    await resetFork(BLOCK_NUMBER)
    ;[player, gov] = await ethers.getSigners()
    whale = (await getImpersonatedSigner(SNX_WHALE)) as any

    await ethers.provider.send('hardhat_setBalance', [whale.address, '0xffffffffffffffffffffff'])
    await ethers.provider.send('hardhat_setBalance', [player.address, '0xffffffffffffffffffffff'])

    proxy = (await ethers.getContractFactory('ProxyERC20')).attach(SNX_ProxyERC20) as ProxyERC20

    expect(await proxy.target()).to.be.eq(SNX_Logic) // check whether the logic address matches the target
  })
  afterEach(async function () {
    await resetFork(BLOCK_NUMBER)
  })
  it('can withdraw locked assets without waiting', async function () {
    // deploy vault
    const vault = (await (await ethers.getContractFactory('HodlVault')).deploy(proxy.address, gov.address)) as HodlVault

    // whale deposits SNX he/she holds to vault
    const amotToDeposit = await proxy.balanceOf(SNX_WHALE)
    await proxy.connect(whale).approve(vault.address, amotToDeposit)
    await vault.connect(whale).hold(amotToDeposit)

    await expect(vault.withdraw(amotToDeposit)).to.be.revertedWith('lock')

    // Because SNX has another entry-point any account can sweep depositd SNX
    await vault.connect(player).sweep(SNX_Logic)
    expect(await proxy.balanceOf(gov.address)).to.be.eq(amotToDeposit)
  })
})
