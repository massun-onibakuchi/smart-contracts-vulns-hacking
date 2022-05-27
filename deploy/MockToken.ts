import { ethers } from "hardhat";

const main = async () => {
    const [signer] = await ethers.getSigners()
    const Mock = await ethers.getContractFactory('WETH', signer)
    const contract = await Mock.deploy()
    console.log('contract.address :>> ', contract.address);
}
main().catch(err => {
    console.log(err)
    process.exit(1)
})
