import { ethers } from 'hardhat'
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { splitSignature } from 'ethers/lib/utils'

const PERMIT_TYPE = [
  { name: 'owner', type: 'address' },
  { name: 'spender', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'deadline', type: 'uint256' },
]

describe('Lack of chainID validation allows signatures to be re-used across forks', async function () {
  let wallets: SignerWithAddress[]
  let owner
  let spender
  let vulnToken
  let chainId
  const name = 'Token0'
  before(async function () {
    ;({ chainId } = await ethers.provider.getNetwork())
    wallets = await ethers.getSigners()
    ;[owner, spender] = wallets
  })
  beforeEach(async function () {
    const ERC20Permit = await ethers.getContractFactory('contracts/ReusedSignature/ERC20Permit.sol:ERC20Permit')
    vulnToken = await ERC20Permit.deploy(name, 'TOKEN0')

    this.approve = { owner: owner.address, spender: spender.address, value: 1000 }
    this.deadline = 100000000000000
    this.nonce = await vulnToken.nonces(owner.address)
    this.signature = await signPermitApproval(
      name,
      '1',
      chainId,
      vulnToken.address,
      this.approve,
      this.nonce,
      this.deadline
    )
  })

  describe('Lack of chainId validation', async function () {
    it('should successfully permit', async function () {
      const { v, r, s } = this.signature
      // Approve it
      await expect(
        vulnToken.permit(this.approve.owner, this.approve.spender, this.approve.value, this.deadline, v, r, s)
      ).to.emit(vulnToken, 'Approval')
      expect(await vulnToken.allowance(this.approve.owner, this.approve.spender)).to.be.equal(this.approve.value)
    })
    it('should successfully replay attack', async function () {
      const { v, r, s } = this.signature
      // Chain split and then chainId changed
      // TODO: chain id changes

      // In the vulnToken contract, DOMAIN_SEPARATOR is defined at the deployments and not updatable.
      // Also, chainId is not included in the signed data as part of the permit call. So, signature will be valid on the both chains

      // Approve it
      await expect(
        vulnToken.permit(this.approve.owner, this.approve.spender, this.approve.value, this.deadline, v, r, s)
      ).to.emit(vulnToken, 'Approval')
      expect(await vulnToken.allowance(this.approve.owner, this.approve.spender)).to.be.equal(this.approve.value)
    })
  })
})

const signPermitApproval = async (
  name: string,
  version: string,
  chainId: number,
  tokenAddress: string,
  approve: {
    owner: string
    spender: string
    value: number
  },
  nonce: number,
  deadline: number
) => {
  const domain = {
    name,
    version,
    chainId,
    verifyingContract: tokenAddress,
  }
  const types = { Permit: PERMIT_TYPE }
  const data = {
    ...approve,
    nonce,
    deadline,
  }

  const signature = await (await ethers.getSigner(approve.owner))._signTypedData(domain, types, data)

  return splitSignature(signature)
}
