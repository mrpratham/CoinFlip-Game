# Coin Flip Game

A simple Coin Flip game built with React and Web3, allowing users to bet on a coin flip with Ethereum. The game interacts with a smart contract deployed on the Sepolia testnet. Users can connect their MetaMask wallet, place bets, and view their balance and game history.

## Features

- Connects to MetaMask wallet
- Bets on coin flip (Heads/Tails)
- Displays game results and balance history
- Light and dark mode support
- Confetti animation on win

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- MetaMask extension installed in your browser

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/your-username/coin-flip-game.git
cd coin-flip-game
```

### Install Dependencies

Install the required dependencies using npm:

```bash
npm install
```

### Set Up Environment Variables

Create a `.env` file in the root of your project and add the following variables:

```plaintext
REACT_APP_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
REACT_APP_CONTRACT_ADDRESS=0xYourContractAddress
```

Replace `YOUR_INFURA_PROJECT_ID` with your Infura project ID and `0xYourContractAddress` with the address of your deployed smart contract.

### Run the Application

Start the development server:

```bash
npm start
```

Your application will be available at `http://localhost:3000`.


## Troubleshooting

- **MetaMask Not Found**: Ensure MetaMask is installed and you are connected to the Sepolia testnet.
- **Error Fetching Token Balance**: Check your RPC URL and ensure the contract address is correct.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Chakra UI](https://chakra-ui.com/)
- [Web3.js](https://web3js.readthedocs.io/)
- [Remix IDE](https://remix.ethereum.org/)

