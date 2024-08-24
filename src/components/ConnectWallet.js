import React, { useState } from 'react';
import { Button, Text, VStack, useToast, useColorModeValue, Image } from '@chakra-ui/react';
import { Web3Provider } from '@ethersproject/providers';
import coinImage from '../assets/coin.png'; // Adjust the path as needed
import './ConnectWallet.css'; // Import CSS file


const ConnectWallet = ({ setSigner }) => {
  const [address, setAddress] = useState('');
  
  const toast = useToast();
  const textColor = useColorModeValue('gray.800', 'white'); // Define textColor based on theme
  const headingColor = useColorModeValue('teal.600', 'teal.300'); // Color for headings
  const subTextColor = useColorModeValue('gray.600', 'gray.400'); // Color for subtext

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Create a provider and signer
        const provider = new Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();

        // Set the signer and address
        setSigner(signer);
        setAddress(address);

        // Show success toast
        toast({
          title: "Connected",
          description: `Wallet connected: ${address}`,
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

  const rotatingStyle = {
    animation: 'rotate3D 3s linear infinite',
    transformStyle: 'preserve-3d',
    perspective: '1000px',
  };

  return (
    <VStack spacing={4} align="center">
      {!address ? (
        <>
          <Text fontSize="xl" color={headingColor} fontWeight="bold">
            <span style={{ color: '#ffdd00', fontSize: '1.2em' }}>Welcome!</span> We're excited to have you here.
          </Text>
          <Text fontSize="lg" color={subTextColor} textAlign="center">
            Please <span style={{ fontWeight: 'bold' }}>connect your wallet</span> to get started with our amazing features and play the game.
          </Text>
          <Image
            src={coinImage}
            alt="Coin"
            boxSize="100px"
            mt={4}
            sx={rotatingStyle}
          />
          <Button colorScheme="teal" size="lg" mt={4} onClick={connectWallet}>
            Connect Wallet
          </Button>
        </>
      ) : (
        <Text fontSize="md" color={textColor}>
          Connected to: <Text as="span" fontWeight="bold" color="teal.500">{address}</Text>
        </Text>
      )}
      <style>
        {`
          @keyframes rotate3D {
            0% {
              transform: rotateY(0deg);
            }
            100% {
              transform: rotateY(360deg);
            }
          }
        `}
      </style>
    </VStack>
  );
};

export default ConnectWallet;
