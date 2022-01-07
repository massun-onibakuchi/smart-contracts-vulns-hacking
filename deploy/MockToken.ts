import { DeployFunction } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const mockTokenDeployment: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = hre
    const { deploy, get } = deployments
    const { owner } = await getNamedAccounts()

    const options = { from: owner }
    const weth = await deploy("WETH", options)
    const token = await deploy("ERC20Mock", { ...options, args: ["Dai Stable Coin", "DAI"] })
}
export default mockTokenDeployment
mockTokenDeployment.tags = ["MockToken"]
