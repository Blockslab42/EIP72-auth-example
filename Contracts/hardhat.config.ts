import { HardhatUserConfig, task } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@nomiclabs/hardhat-web3'

const account = {
  mnemonic:
    'bleak west pretty uncover robot weird resource mistake buzz detail symptom slush',
  path: "m/44'/60'/0'/0",
  initialIndex: 0,
  count: 20,
  passphrase: '',
}

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.9',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337, // network config 1337 is for test for exemple mainnet ETH : 1
    },
    localhost: {
      url: 'http://localhost:8545',
      chainId: 1337,
    },
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/3b9c944ca9d444be837d554e0db50d4d',
      accounts: account,
    },
  },
}

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

export default config
