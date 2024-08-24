import React, { useState, useEffect } from 'react';
import { Box, Button, Input, Select, Text, VStack, useToast, Spinner, useColorMode, useColorModeValue, Switch, Icon, Tooltip } from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa';
import Web3 from 'web3';
import Confetti from 'react-confetti';
import './CoinFlip.css'; // Ensure styles for animations and design

const SEPOLIA_RPC_URL = 'https://sepolia.infura.io/v3/b790af7cf47a484d90268cd972b806c2'; // Replace with your RPC URL
const CONTRACT_ADDRESS = '0x22459F84789de2b2815a620f270c0163b3cbE7f9'; // Replace with your deployed contract address
const CONTRACT_ABI = [
  { "constant": false, "inputs": [], "name": "deposit", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" },
  { "constant": false, "inputs": [{ "name": "amount", "type": "uint256" }], "name": "withdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" },
  { "constant": false, "inputs": [{ "name": "won", "type": "bool" }], "name": "bet", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" },
  { "constant": true, "inputs": [], "name": "getBalance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }
];

const CoinFlipGame = () => {
  const [amount, setAmount] = useState('');
  const [side, setSide] = useState('heads');
  const [result, setResult] = useState(null);
  const [flipping, setFlipping] = useState(false);
  const [coinFace, setCoinFace] = useState('');
  const [tokenBalance, setTokenBalance] = useState(0);
  const [address, setAddress] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [balanceHistory, setBalanceHistory] = useState([]);
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const boxBg = useColorModeValue('gray.100', 'gray.700');
  const boxBorder = useColorModeValue('gray.300', 'gray.600');
  const buttonBg = useColorModeValue('teal.400', 'teal.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const resultColor = result === side ? 'green.500' : 'red.500';

  useEffect(() => {
    if (result === side) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [result]);

  useEffect(() => {
    if (window.ethereum) {
      loadTokenBalance();
    }
  }, [address]);

  const loadTokenBalance = async () => {
    try {
      const web3 = new Web3(new Web3.providers.HttpProvider(SEPOLIA_RPC_URL));
      const balance = await web3.eth.getBalance(address);
      setTokenBalance(web3.utils.fromWei(balance, 'ether'));
    } catch (error) {
      console.error("Error fetching token balance:", error);
      toast({
        title: "Error",
        description: "There was an error fetching the token balance.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleFlip = async () => {
    if (!amount || !window.ethereum) {
      toast({
        title: "Input Error",
        description: "Please enter an amount and connect your wallet.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (parseFloat(amount) > tokenBalance) {
      toast({
        title: "Insufficient Tokens",
        description: "You don't have enough tokens for this bet.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setFlipping(true);
    setCoinFace('');

    try {
      const isHeads = Math.random() < 0.5;
      const outcome = isHeads ? 'heads' : 'tails';
      setResult(outcome);
      setCoinFace(outcome);

      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      const parsedAmount = web3.utils.toWei(amount, 'ether');

      if (outcome === side) {
        await contract.methods.deposit().send({ from: accounts[0], value: parsedAmount });
        setTokenBalance(tokenBalance + parseFloat(amount));
        setBalanceHistory([...balanceHistory, { type: 'Win', amount: parseFloat(amount), outcome, date: new Date().toLocaleString() }]);
        toast({
          title: "Congratulations!",
          description: `You won! The coin landed on ${outcome}. You earned ${amount} ETH.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        await contract.methods.withdraw(parsedAmount).send({ from: accounts[0] });
        setTokenBalance(tokenBalance - parseFloat(amount));
        setBalanceHistory([...balanceHistory, { type: 'Loss', amount: parseFloat(amount), outcome, date: new Date().toLocaleString() }]);
        toast({
          title: "Try Again",
          description: `You lost. The coin landed on ${outcome}. You lost ${amount} ETH.`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error during coin flip:", error);
      toast({
        title: "Error",
        description: `There was an error during the coin flip: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setFlipping(false);
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        setAddress(accounts[0]);
        loadTokenBalance();
        toast({
          title: "Connected",
          description: `Wallet connected: ${accounts[0]}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        toast({
          title: "Connection Failed",
          description: "Failed to connect wallet. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask!",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4} align="center" position="relative" width="100%">
      {/* Theme Switch Button */}
      <Box position="absolute" top={4} right={4} display="flex" alignItems="center" zIndex="docked">
        <Icon as={FaSun} boxSize={6} color={colorMode === 'light' ? 'yellow.500' : 'gray.300'} />
        <Switch
          isChecked={colorMode === 'dark'}
          onChange={toggleColorMode}
          size="lg"
          mx={4}
          _focus={{ boxShadow: 'none' }}
        />
        <Icon as={FaMoon} boxSize={6} color={colorMode === 'dark' ? 'blue.500' : 'gray.300'} />
      </Box>

      {/* Connect Wallet Button */}
      <Button colorScheme="teal" onClick={connectWallet} mb={4}>
        Connect Wallet
      </Button>

      {/* Coin Flip Game */}
      <Box
        p={[6, 8]}
        borderWidth={2}
        borderRadius="lg"
        shadow="xl"
        bg={boxBg}
        borderColor={boxBorder}
        width="100%"
        maxWidth="600px"
        position="relative"
        overflow="hidden"
      >
        <Text fontSize={['2xl', '4xl']} fontWeight="bold" mb={2} textAlign="center">
          Coin Flip Game
        </Text>
        <Text fontSize="lg" mb={4} textAlign="center" color={textColor}>
          Try your luck and double your tokens!
        </Text>
        <Tooltip label="Enter the amount of ETH to bet" aria-label="Bet Amount">
          <Text fontSize="md" mb={2}>Bet Amount (ETH):</Text>
        </Tooltip>
        <Input
          type="number"
          step="0.01"
          min="0"
          placeholder="0.1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          mb={4}
          textAlign="center"
        />
        <Text fontSize="lg" mb={2}>Choose Side:</Text>
        <Select
          placeholder="Select side"
          value={side}
          onChange={(e) => setSide(e.target.value)}
          mb={4}
          textAlign="center"
        >
          <option value="heads">Heads</option>
          <option value="tails">Tails</option>
        </Select>
        <Button
          colorScheme="teal"
          onClick={handleFlip}
          isLoading={flipping}
          mb={4}
        >
          Flip Coin
        </Button>
        {flipping && (
          <Box display="flex" justifyContent="center">
            <Spinner size="xl" />
          </Box>
        )}
        {coinFace && (
          <Box textAlign="center" mt={4} position="relative">
            <Text fontSize="2xl" fontWeight="bold" color={resultColor}>
              The coin landed on <Text as="span" fontWeight="bold">{coinFace}</Text>
            </Text>
            <div className={`coin ${coinFace} ${flipping ? 'flipping' : ''}`}></div>
          </Box>
        )}
        {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      </Box>

      {/* Balance History */}
      <Box p={[4, 6]} borderWidth={2} borderRadius="lg" shadow="xl" bg={boxBg} borderColor={boxBorder} width="100%" maxWidth="600px">
        <Text fontSize="lg" fontWeight="bold" mb={4} textAlign="center">Balance History</Text>
        {balanceHistory.length > 0 ? (
          balanceHistory.map((entry, index) => (
            <Box key={index} p={3} borderWidth={1} borderRadius="md" mb={2} bg={entry.type === 'Win' ? 'green.50' : 'red.50'}>
              <Text fontSize="md">{entry.date} - {entry.type}: {entry.amount} ETH - Coin: {entry.outcome}</Text>
            </Box>
          ))
        ) : (
          <Text fontSize="md" textAlign="center">No history available</Text>
        )}
      </Box>
    </VStack>
  );
};

export default CoinFlipGame;
