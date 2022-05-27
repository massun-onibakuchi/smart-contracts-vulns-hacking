import { ethers } from 'hardhat'
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { EvaluationOrderTrick } from '../typechain-types'

describe('EvaluationOrderTrick', async function () {
  let admin: SignerWithAddress
  let wallet: SignerWithAddress
  let contract: EvaluationOrderTrick
  before(async function () {
    ;[admin, wallet] = await ethers.getSigners()
  })
  beforeEach(async function () {
    const mock = await (await ethers.getContractFactory('ERC20Mock')).deploy('', '')
    const Factory = await ethers.getContractFactory('EvaluationOrderTrick', admin)
    contract = (await Factory.deploy(mock.address)) as EvaluationOrderTrick
  })

  it('Bug-1', async function () {
    await contract.prepareChangingAdmin(wallet.address)
    expect(await contract.preAdmin()).to.be.equal(ethers.constants.AddressZero)
    await expect(contract.claimAdmin()).to.be.revertedWith('only-assigned-admin')
  })

  it('Bug-2', async function () {
    await expect(contract.changeKeeper(wallet.address)).to.be.revertedWith('keeper-zero-address')
  })
})
