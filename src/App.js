// src/App.js
import React, { useState } from 'react';
import { ChakraProvider, Box, useColorMode, Button } from '@chakra-ui/react';
import ConnectWallet from './components/ConnectWallet';
import CoinFlip from './components/CoinFlip';
import theme from './theme';

function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [signer, setSigner] = useState(null);

  const App = () => {
    return (
      <div className="App">
        <CoinFlip />
      </div>
    );
  };

  return (
    <ChakraProvider theme={theme}>
      <Box p={4}>
        {/* <Button onClick={toggleColorMode} mb={4}>
          Switch to {colorMode === 'light' ? 'Dark' : 'Light'} Mode
        </Button> */}
        <ConnectWallet setSigner={setSigner} />
        {signer && <CoinFlip signer={signer} />}
      </Box>
    </ChakraProvider>
  );
}

export default App;
