import { expect } from 'chai'
import { BigNumber, BigNumberish, Signer } from 'ethers'
import hre, { ethers, network } from 'hardhat'

const toWei = ethers.utils.parseEther

async function overwriteStorage(address: string, slot: string, value: BigNumber) {
  const hexValue = '0x' + value.toHexString().slice(2).padStart(64, '0')
  const prevValue = await network.provider.send('eth_getStorageAt', [address, slot])
  console.log(`Set Storage at ${slot} from ${prevValue} to ${hexValue}`)

  await network.provider.send('hardhat_setStorageAt', [address, slot, hexValue])
}

async function getStorageAt(address: string, slot: string) {
  return await network.provider.send('eth_getStorageAt', [address, slot])
}

async function getImpersonatedSigner(address: string): Promise<Signer> {
  await network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [address],
  })

  const signer = await ethers.getSigner(address)

  return signer
}

async function resetFork(blockNumber?, jsonRpcUrl?) {
  await network.provider.request({
    method: 'hardhat_reset',
    params: [
      {
        forking: {
          jsonRpcUrl: jsonRpcUrl || hre.config.networks.hardhat.forking.url,
          blockNumber,
        },
      },
    ],
  })
}

async function snapshot() {
  return network.provider.send('evm_snapshot', [])
}

async function restore(snapshotId) {
  return network.provider.send('evm_revert', [snapshotId])
}

async function latestTime(): Promise<number> {
  const { timestamp } = await ethers.provider.getBlock(await ethers.provider.getBlockNumber())

  return timestamp as number
}

async function mine(): Promise<void> {
  await hre.network.provider.request({
    method: 'evm_mine',
  })
}

// expectApproxAbs(a, b, c) checks if b is between [a-c, a+c]
function expectApproxAbs(actual: BigNumberish, expected: BigNumberish, diff = '1000') {
  const actualBN = BigNumber.from(actual)
  const expectedBN = BigNumber.from(expected)
  const diffBN = BigNumber.from(diff)

  const lowerBound = expectedBN.sub(diffBN)
  const upperBound = expectedBN.add(diffBN)

  expect(actualBN).to.be.gte(lowerBound)
  expect(actualBN).to.be.lte(upperBound)
}

export {
  toWei,
  overwriteStorage,
  getStorageAt,
  getImpersonatedSigner,
  resetFork,
  snapshot,
  restore,
  latestTime,
  mine,
  expectApproxAbs,
}
