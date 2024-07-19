import React from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Text,
  Skeleton,
  HStack,
  VStack,
  useColorModeValue,
  Flex,
  Tooltip
} from '@chakra-ui/react';
import { TriangleUpIcon, TriangleDownIcon, InfoOutlineIcon, WarningIcon } from '@chakra-ui/icons';
import { formatCurrency } from './utils';

const PortfolioGrid = ({ positions, positionDetails, sortedPositions, handleRequestSort, orderBy, order, view, loading, error }) => {
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');

  const formatChange = (change, percent, isTable) => {
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

  const calculateDividends = (dividends = [], quantity) => {
    const currentYear = new Date().getFullYear();
    const thisYearDividends = dividends.filter(dividend => new Date(dividend.date).getFullYear() === currentYear);
    const totalDividends = thisYearDividends.reduce((total, dividend) => total + dividend.amount, 0);
    return {
      thisYearDividends,
      totalDividends: (totalDividends * quantity).toFixed(2)
    };
  };

  const renderTableContent = () => {
    if (error) {
      return (
        <Tr>
          <Td colSpan={6}>
            <Box textAlign="center" py={4}>
              <WarningIcon boxSize={8} color="red.500" />
              <Text mt={2} color="gray.600" fontSize="lg">Ошибка при получении данных, попробуйте позже</Text>
            </Box>
          </Td>
        </Tr>
      );
    }

    const filteredPositions = sortedPositions().filter(position => position.instrument_type === 'share');

    if (filteredPositions.length === 0) {
      return (
        <Tr>
          <Td colSpan={6}>
            <Box textAlign="center" py={4}>
              <InfoOutlineIcon boxSize={8} color="gray.500" />
              <Text mt={2} color="gray.500">Нет данных для отображения</Text>
            </Box>
          </Td>
        </Tr>
      );
    }

    return filteredPositions.map((position) => {
      const details = positionDetails[position.ticker];
      const { thisYearDividends, totalDividends } = details ? calculateDividends(details.dividends, details.quantity) : { thisYearDividends: [], totalDividends: 0 };
      return (
        <Tr key={position.ticker} _hover={{ bg: hoverBgColor }}>
          <Td>
            <HStack>
              <Avatar src={position.image_url} name={position.name} size="sm" />
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold">{position.name}</Text>
                <Text fontSize="xs" color="gray.500">{position.ticker}</Text>
              </VStack>
            </HStack>
          </Td>
          <Td isNumeric>
            {loading ? <Skeleton height="20px" width="80px" ml="auto" /> : <Text>{formatCurrency(details.price)} ₽</Text>}
          </Td>
          <Td isNumeric>
            {loading ? (
              <Skeleton height="40px" width="100px" ml="auto" />
            ) : (
              <VStack spacing={0} align="flex-end">
                <Text fontWeight="bold">{formatCurrency(details.price * details.quantity)} ₽</Text>
                <Text fontSize="xs" color="gray.500">{details.quantity} шт.</Text>
              </VStack>
            )}
          </Td>
          <Td isNumeric>
            {loading ? (
              <Skeleton height="40px" width="100px" ml="auto" />
            ) : (
              <Flex justify="flex-end" align="center">
                <VStack spacing={0} align="flex-end" mr={2}>
                  <Text>{thisYearDividends[0]?.amount ? formatCurrency(thisYearDividends[0].amount) + ' ₽' : '—'}</Text>
                  <Text fontSize="xs" color="gray.500">{thisYearDividends[0] ? new Date(thisYearDividends[0].date).toLocaleDateString() : ''}</Text>
                </VStack>
                <Box width="16px" textAlign="center">
                  {thisYearDividends.length > 1 && (
                    <Tooltip
                      label={
                        <Box>
                          {thisYearDividends.map((dividend, index) => (
                            <Text key={index} fontSize="xs">
                              {new Date(dividend.date).toLocaleDateString('ru')}: {formatCurrency(dividend.amount)} ₽
                            </Text>
                          ))}
                        </Box>
                      }
                      placement="top"
                    >
                      <InfoOutlineIcon color="gray.500" boxSize={3} />
                    </Tooltip>
                  )}
                </Box>
              </Flex>
            )}
          </Td>
          <Td isNumeric>
            {loading ? (
              <Skeleton height="20px" width="80px" ml="auto" />
            ) : (
              totalDividends === "0.00" ? '—' : <Text>{formatCurrency(parseFloat(totalDividends))} ₽</Text>
            )}
          </Td>
          <Td isNumeric>
            {loading ? (
              <Skeleton height="40px" width="100px" ml="auto" />
            ) : (
              view === 'today' ?
                formatChange(details.daily_change, details.daily_change_percent, true) :
                formatChange(details.change, details.change_percent, true)
            )}
          </Td>
        </Tr>
      );
    });
  };

  return (
    <Box overflowX="auto">
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th onClick={() => handleRequestSort('name')} cursor="pointer">
              Название {orderBy === 'name' && (order === 'asc' ? <TriangleUpIcon ml={1} /> : <TriangleDownIcon ml={1} />)}
            </Th>
            <Th isNumeric onClick={() => handleRequestSort('price')} cursor="pointer">
              Цена {orderBy === 'price' && (order === 'asc' ? <TriangleUpIcon ml={1} /> : <TriangleDownIcon ml={1} />)}
            </Th>
            <Th isNumeric onClick={() => handleRequestSort('totalValue')} cursor="pointer">
              Стоимость {orderBy === 'totalValue' && (order === 'asc' ? <TriangleUpIcon ml={1} /> : <TriangleDownIcon ml={1} />)}
            </Th>
            <Th isNumeric onClick={() => handleRequestSort('dividends')} cursor="pointer">
              Дивиденды {orderBy === 'dividends' && (order === 'asc' ? <TriangleUpIcon ml={1} /> : <TriangleDownIcon ml={1} />)}
            </Th>
            <Th isNumeric onClick={() => handleRequestSort('totalDividends')} cursor="pointer">
              Итого див. {orderBy === 'totalDividends' && (order === 'asc' ? <TriangleUpIcon ml={1} /> : <TriangleDownIcon ml={1} />)}
            </Th>
            <Th isNumeric onClick={() => handleRequestSort('change')} cursor="pointer">
              {view === 'today' ? "За сегодня" : "За все время"} {orderBy === 'change' && (order === 'asc' ? <TriangleUpIcon ml={1} /> : <TriangleDownIcon ml={1} />)}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {renderTableContent()}
        </Tbody>
      </Table>
    </Box>
  );
};

export default PortfolioGrid;