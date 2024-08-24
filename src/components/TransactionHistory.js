import React, { useState, useEffect } from 'react';
import { Box, Text, List, ListItem } from '@chakra-ui/react';

const TransactionHistory = ({ transactions }) => {
  return (
    <Box mt={4}>
      <Text fontSize="lg" mb={2}>Transaction History</Text>
      <List spacing={3}>
        {transactions.map((tx, index) => (
          <ListItem key={index}>
            <Text>Transaction Hash: {tx.hash}</Text>
            <Text>Status: {tx.status}</Text>
            <Text>Amount: {tx.amount} ETH</Text>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TransactionHistory;
