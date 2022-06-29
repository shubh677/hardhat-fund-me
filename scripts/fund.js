const { getNamedAccounts, ethers } = require("hardhat")

async function main(){

	const deployer = await (getNamedAccounts()).deployer
	const fundMe = await ethers.getContract("FundMe",deployer)
	console.log("\nFunding Contract...\n")
	const transactionResponse = await fundMe.fund({value:ethers.utils.parseEther("0.1")})
	await transactionResponse.wait(1)
	console.log(`\nFundMe Contract at ${fundMe.address} Successfully Funded!\n`)
	console.log(`\nCurrent Contract Balance is ${ethers.utils.formatEther(await fundMe.provider.getBalance(fundMe.address))} Ether.\n`)

}


main()
  .then(()=>process.exit(0))
  .catch((error)=>{
	console.log(error)
	process.exit(1)
})