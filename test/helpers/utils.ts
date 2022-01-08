import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { BigNumber } from 'ethers'
import hre, { ethers, network } from 'hardhat'

async function overwriteStorage(address: string, slot: string, value: BigNumber) {
  const hexValue = '0x' + value.toHexString().slice(2).padStart(64, '0')
  const prevValue = await network.provider.send('eth_getStorageAt', [address, slot])
  console.log(`Set Storage at ${slot} from ${prevValue} to ${hexValue}`)

  await network.provider.send('hardhat_setStorageAt', [address, slot, hexValue])
}

async function getImpersonatedSigner(address: string): Promise<SignerWithAddress> {
  await network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [address],
  })

  const signer = await ethers.getSigner(address)

  return signer
}

async function resetFork(blockNumber?) {
  await network.provider.request({
    method: 'hardhat_reset',
    params: [
      {
        forking: {
          jsonRpcUrl: hre.config.networks.hardhat.forking.url,
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

export { overwriteStorage, getImpersonatedSigner, resetFork, snapshot, restore }
