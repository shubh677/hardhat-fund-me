const { deployments, ethers, getNamedAccounts, network } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChains } = require("../../helper-hardhat-config")



!developmentChains.includes(network.name)
? describe.skip
: describe("FundMe",function(){
	let fundMe
	let deployer
	let mockV3Aggregator
	const sendValue = ethers.utils.parseEther("1")

	beforeEach(async function(){

		deployer = (await getNamedAccounts()).deployer
		await deployments.fixture(['all'])
		fundMe = await ethers.getContract("FundMe",deployer)
		mockV3Aggregator = await ethers.getContract("MockV3Aggregator",deployer)

	})


	describe("constructor",function(){

		it("it sets the aggregator address correctly",async function(){


			const response = await fundMe.getPriceFeed()

			assert.equal(response,mockV3Aggregator.address)


		})


	})

	describe("fundMe function",function(){

		it("fails if you don't send enough eth",async function(){
			await expect(fundMe.fund()).to.be.reverted
		})

		it("it updates the funded data structure",async function(){

			await fundMe.fund({value:sendValue})
			const response = await fundMe.getAddressToAmountFunded(deployer)
			expect(response).to.equal(sendValue)
		})

		it("funders are added to the funders array",async function(){

			await fundMe.fund({value:sendValue})
			const funder = await fundMe.getFunder(0)
			assert.equal(funder,deployer)
		})
	})

	describe("withdraw function",function(){

		beforeEach(async function(){
			await fundMe.fund({value:sendValue})
			
		})

		it("withdraw ETH from a single funder",async function(){

			//Arrange
			const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
			const startingOwnerBalance = await fundMe.provider.getBalance(deployer)

			//Act
			const transactionResponse = await fundMe.withdraw()
			const transactionReceipt = await transactionResponse.wait(1)
			const { gasUsed, effectiveGasPrice } = transactionReceipt
			const gasCost = gasUsed.mul(effectiveGasPrice)
			const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
			const endingOwnerBalance = await fundMe.provider.getBalance(deployer)

			//assert
			assert.equal(endingFundMeBalance,0)
			assert.equal(startingFundMeBalance.add(startingOwnerBalance).toString(),endingOwnerBalance.add(gasCost).toString())
		})

		it("allows us to withdraw with multiple funders",async function(){

			//arrange

			const accounts = await ethers.getSigners()

			for(let i=1;i<6;i++){
				const fundMeConnectedContract = await fundMe.connect(accounts[i])
				await fundMeConnectedContract.fund({value:sendValue})

			}
			const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
			const startingOwnerBalance = await fundMe.provider.getBalance(deployer)

			//act
			const transactionResponse = await fundMe.withdraw()
			const transactionReceipt = await transactionResponse.wait(1)
			const { gasUsed, effectiveGasPrice } = transactionReceipt
			const gasCost = gasUsed.mul(effectiveGasPrice)
			const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
			const endingOwnerBalance = await fundMe.provider.getBalance(deployer)

			//assert
			assert.equal(endingFundMeBalance.toString(),0)
			assert.equal(startingFundMeBalance.add(startingOwnerBalance).toString(),endingOwnerBalance.add(gasCost).toString())
			// make sure that funders are reset properly
			await expect(fundMe.getFunder(0)).to.be.reverted

			for(let i=0;i<6;i++){
				const account = accounts[i].address
				const amount = await fundMe.getAddressToAmountFunded(account)
				assert.equal(amount.toString(),0)
			}




	})

		it("only the contract owner can withdraw funds",async function(){
			const accounts = await ethers.getSigners()
			const notOwnerAccount = accounts[1]
			const notOwnerConnectedContract = fundMe.connect(notOwnerAccount)

			await expect(notOwnerConnectedContract.withdraw()).to.be.revertedWith("FundMe__NotOwner")
		})

		it("cheaperWithdraw testing...allows us to withdraw with single funder",async function(){

			//Arrange
			const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
			const startingOwnerBalance = await fundMe.provider.getBalance(deployer)

			//Act
			const transactionResponse = await fundMe.cheaperWithdraw()
			const transactionReceipt = await transactionResponse.wait(1)
			const { gasUsed, effectiveGasPrice } = transactionReceipt
			const gasCost = gasUsed.mul(effectiveGasPrice)
			const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
			const endingOwnerBalance = await fundMe.provider.getBalance(deployer)

			//assert
			assert.equal(endingFundMeBalance,0)
			assert.equal(startingFundMeBalance.add(startingOwnerBalance).toString(),endingOwnerBalance.add(gasCost).toString())
		})

		it("cheaperWithdraw testing...allows us to withdraw with multiple funders",async function(){

			//arrange

			const accounts = await ethers.getSigners()

			for(let i=1;i<6;i++){
				const fundMeConnectedContract = await fundMe.connect(accounts[i])
				await fundMeConnectedContract.fund({value:sendValue})

			}
			const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
			const startingOwnerBalance = await fundMe.provider.getBalance(deployer)

			//act
			const transactionResponse = await fundMe.cheaperWithdraw()
			const transactionReceipt = await transactionResponse.wait(1)
			const { gasUsed, effectiveGasPrice } = transactionReceipt
			const gasCost = gasUsed.mul(effectiveGasPrice)
			const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
			const endingOwnerBalance = await fundMe.provider.getBalance(deployer)

			//assert
			assert.equal(endingFundMeBalance.toString(),0)
			assert.equal(startingFundMeBalance.add(startingOwnerBalance).toString(),endingOwnerBalance.add(gasCost).toString())
			// make sure that funders are reset properly
			await expect(fundMe.getFunder(0)).to.be.reverted

			for(let i=0;i<6;i++){
				const account = accounts[i].address
				const amount = await fundMe.getAddressToAmountFunded(account)
				assert.equal(amount.toString(),0)
			}




	})
})
})