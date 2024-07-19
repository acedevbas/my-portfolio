// src/utils.js
import { Box, Text } from '@chakra-ui/react';

export const formatCurrency = (value) => {
  if (typeof value !== 'number') {
    return value;
  }
  return value.toFixed(2).replace(/\.?0+$/, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const formatChange = (change, percent, isTable) => {
  const color = change >= 0 ? 'green.500' : 'red.500';
  return (
    <Box>
      <Text color={color} fontWeight="bold" fontSize={isTable ? 'sm' : 'xl'}>
        {change >= 0 ? '+' : ''}{change?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₽
      </Text>
      {isTable && (
        <Text fontSize="xs" color={color}>
          {percent?.toFixed(2)}%
        </Text>
      )}
    </Box>
  );
};

export const calculateDividends = (dividends = [], quantity) => {
  const currentYear = new Date().getFullYear();
  const thisYearDividends = dividends.filter(dividend => new Date(dividend.date).getFullYear() === currentYear);
  const totalDividends = thisYearDividends.reduce((total, dividend) => total + dividend.amount, 0);
  return {
    thisYearDividends,
    totalDividends: (totalDividends * quantity).toFixed(2)
  };
};