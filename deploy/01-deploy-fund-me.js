const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
require("dotenv").config()


module.exports=async ({getNamedAccounts, deployments})=>{

	const { deploy, log } = deployments
	const {deployer} = await getNamedAccounts()
	const chainId = network.config.chainId

	let priceFeedAddress

	if (developmentChains.includes(network.name)){

		const priceFeedContract=await deployments.get('MockV3Aggregator')
		priceFeedAddress = priceFeedContract.address

	}

	else{
		priceFeedAddress= networkConfig[chainId]["ethUsdPriceFeed"]
	}

	const args = [priceFeedAddress]

	const fundMe = await deploy("FundMe",{
		from: deployer,
		args: args,
		log: true,
		waitConfirmations: network.config.blockConfirmations || 1
	})

	if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){

		await verify(fundMe.address,args)
	}

	log("------------------------------------------------------------")
}

module.exports.tags= ['all','fundMe']