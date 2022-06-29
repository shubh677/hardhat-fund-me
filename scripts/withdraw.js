const { getNamedAccounts, ethers } = require("hardhat")

async function main(){

	const deployer = (await getNamedAccounts()).deployer
	const fundMe = await ethers.getContract("FundMe",deployer)
	const startingBalance = ethers.utils.formatEther(await fundMe.provider.getBalance(fundMe.address))
	console.log(
		`\nCurrent Balance of FundMe Contract is ${ethers.utils.formatEther(await fundMe.provider.getBalance(fundMe.address))} Eth.\n`
		)
	console.log("\nWithdrawing Eth...")
	const transactionResponse = await fundMe.cheaperWithdraw()
	await transactionResponse.wait(1)
	console.log("\nSuccessfully Withdrawed Eth!\n")
	console.log(
		`Current Balance of FundMe Contract is ${ethers.utils.formatEther(await fundMe.provider.getBalance(fundMe.address))} Eth\n`
		)
}



main()
  .then(()=>process.exit(0))
  .catch((error)=>{
	console.log(error)
	process.exit(1)
})