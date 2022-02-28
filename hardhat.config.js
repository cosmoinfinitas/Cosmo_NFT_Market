require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
	networks: {
		hardhat: {
			chainId: 1337,
		},
		mumbai: {
			url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.projectId}`,
			accounts: [process.env.PRIVATE_KEY],
		},
		// rinkeby: {
		// 	url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.projectId}`,
		// 	accounts: [process.env.PRIVATE_KEY],
		// },
	},
	solidity: "0.8.4",
};
