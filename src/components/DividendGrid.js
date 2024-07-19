import React from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Avatar, Text, Skeleton, HStack, VStack, useColorModeValue } from '@chakra-ui/react';
import { TriangleUpIcon, TriangleDownIcon, WarningIcon } from '@chakra-ui/icons';

const DividendGrid = ({ sortedDividends, loading, error, handleRequestSort, orderBy, order, onStockClick }) => {
  const formatCurrency = (value) => {
    if (typeof value !== 'number') {
      return value;
    }
    return value.toFixed(2).replace(/\.?0+$/, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');

  return (
    <Box overflowX="auto">
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th onClick={() => handleRequestSort('title')} cursor="pointer">
              Название {orderBy === 'title' && (order === 'asc' ? <TriangleUpIcon ml={1} /> : <TriangleDownIcon ml={1} />)}
            </Th>
            <Th isNumeric onClick={() => handleRequestSort('quantity')} cursor="pointer">
              Кол-во акций {orderBy === 'quantity' && (order === 'asc' ? <TriangleUpIcon ml={1} /> : <TriangleDownIcon ml={1} />)}
            </Th>
            <Th isNumeric onClick={() => handleRequestSort('dividendYieldPercent')} cursor="pointer">
              Див. доходность {orderBy === 'dividendYieldPercent' && (order === 'asc' ? <TriangleUpIcon ml={1} /> : <TriangleDownIcon ml={1} />)}
            </Th>
            <Th isNumeric onClick={() => handleRequestSort('amount')} cursor="pointer">
              Размер выплаты {orderBy === 'amount' && (order === 'asc' ? <TriangleUpIcon ml={1} /> : <TriangleDownIcon ml={1} />)}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {loading ? (
            Array(5).fill(0).map((_, index) => (
              <Tr key={index}>
                <Td><Skeleton height="40px" width="100%" /></Td>
                <Td isNumeric><Skeleton height="20px" width="80px" ml="auto" /></Td>
                <Td isNumeric><Skeleton height="20px" width="80px" ml="auto" /></Td>
                <Td isNumeric><Skeleton height="20px" width="50px" ml="auto" /></Td>
              </Tr>
            ))
          ) : error ? (
            <Tr>
              <Td colSpan={4}>
                <Box textAlign="center" py={4}>
                  <WarningIcon boxSize={8} color="gray.500" />
                  <Text mt={2} color="gray.500">Ошибка при получении данных, попробуйте позже</Text>
                </Box>
              </Td>
            </Tr>
          ) : sortedDividends().map((dividend, index) => (
            <Tr key={index} _hover={{ bg: hoverBgColor }}>
              <Td onClick={() => onStockClick(dividend.ticker)} cursor="pointer">
                <HStack>
                  <Avatar src={dividend.image || ''} size="sm" />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold">{dividend.title || 'N/A'}</Text>
                    <Text fontSize="xs" color="gray.500">{dividend.start ? new Date(dividend.start).toLocaleDateString('ru') : 'N/A'}</Text>
                  </VStack>
                </HStack>
              </Td>
              <Td isNumeric>{dividend.quantity || 'N/A'}</Td>
              <Td isNumeric>
                <VStack spacing={0} align="flex-end">
                  <Text fontWeight="bold">{dividend.amount && dividend.quantity ? formatCurrency(dividend.amount / dividend.quantity) : 'N/A'} ₽</Text>
                  <Text fontSize="xs" color="gray.500">{dividend.dividendYieldPercent !== undefined ? dividend.dividendYieldPercent.toFixed(2) : 'N/A'}%</Text>
                </VStack>
              </Td>
              <Td isNumeric fontWeight="bold" color="teal.500">
                {dividend.amount !== undefined ? formatCurrency(dividend.amount) : 'N/A'} ₽
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default DividendGrid;