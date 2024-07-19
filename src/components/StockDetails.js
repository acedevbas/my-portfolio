import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  VStack,
  HStack,
  Table,
  Th,
  Td,
  Tr,
  Thead,
  Tbody,
  Heading,
  Text,
  Image,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Skeleton,
  Button,
  useTheme,
  Badge,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons';

// Новый компонент таблицы деталей дивидендов
const DividendDetailsTable = ({ dividends, handleRequestSort, orderBy, order }) => {
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Box overflowX="auto">
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th onClick={() => handleRequestSort('date')} cursor="pointer">
              Дата выплаты{' '}
              {orderBy === 'date' && (order === 'asc' ? <TriangleUpIcon ml={1} /> : <TriangleDownIcon ml={1} />)}
            </Th>
            <Th isNumeric onClick={() => handleRequestSort('amount')} cursor="pointer">
              Сумма{' '}
              {orderBy === 'amount' && (order === 'asc' ? <TriangleUpIcon ml={1} /> : <TriangleDownIcon ml={1} />)}
            </Th>
            <Th isNumeric onClick={() => handleRequestSort('dividend_yield_percent')} cursor="pointer">
              Доходность{' '}
              {orderBy === 'dividend_yield_percent' &&
                (order === 'asc' ? <TriangleUpIcon ml={1} /> : <TriangleDownIcon ml={1} />)}
            </Th>
            <Th onClick={() => handleRequestSort('last_buy_date')} cursor="pointer">
              Последний день покупки{' '}
              {orderBy === 'last_buy_date' &&
                (order === 'asc' ? <TriangleUpIcon ml={1} /> : <TriangleDownIcon ml={1} />)}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {dividends.map((dividend, index) => (
            <Tr key={index} _hover={{ bg: hoverBgColor }}>
              <Td>
                <Text fontWeight="bold">{formatDate(dividend.date)}</Text>
              </Td>
              <Td isNumeric>
                <Text fontWeight="bold" color="teal.500">
                  {formatCurrency(dividend.amount)}
                </Text>
              </Td>
              <Td isNumeric>
                <VStack spacing={0} align="flex-end">
                  <Text fontWeight="bold">{dividend.dividend_yield_percent.toFixed(2)}%</Text>
                </VStack>
              </Td>
              <Td>
                <Text>{formatDate(dividend.last_buy_date)}</Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

const StockDetails = ({ ticker, onBack }) => {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderBy, setOrderBy] = useState('date');
  const [order, setOrder] = useState('desc');

  const theme = useTheme();
  const textColor = useColorModeValue('gray.800', 'white');
  const lineColor = theme.colors.blue[500];
  const gridColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
        const response = await axios.get(`http://192.168.1.129:5000/api/stock_details?ticker=${ticker}`);
        setStockData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stock details:', error);
        setLoading(false);
      }
    };

    fetchStockDetails();
  }, [ticker]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedDividends = () => {
    if (!stockData) return [];
    return [...stockData.dividends].sort((a, b) => {
      let comparison = 0;
      if (a[orderBy] > b[orderBy]) {
        comparison = 1;
      } else if (a[orderBy] < b[orderBy]) {
        comparison = -1;
      }
      return order === 'desc' ? comparison * -1 : comparison;
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box bg="white" p={3} boxShadow="md" borderRadius="md" fontSize="sm">
          <Text fontWeight="bold">{formatDate(label)}</Text>
          <Text>{formatCurrency(payload[0].value)}</Text>
        </Box>
      );
    }
    return null;
  };

  const chartData = useMemo(() => {
    if (!stockData) return [];
    return stockData.dividends
      .map((div) => ({
        date: div.date,
        amount: div.amount,
      }))
      .reverse();
  }, [stockData]);

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          <Skeleton height="200px" />
          <Skeleton height="300px" />
        </VStack>
      </Container>
    );
  }

  if (!stockData) {
    return <Text>Ошибка загрузки данных об акции.</Text>;
  }

  const averageAmount = chartData.reduce((sum, dataPoint) => sum + dataPoint.amount, 0) / chartData.length;

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="container.xl">
        <Button
          leftIcon={<ArrowBackIcon />}
          onClick={onBack}
          mb={6}
          colorScheme="teal"
          variant="solid"
        >
          Назад к календарю
        </Button>
        <VStack spacing={8} align="stretch">
          <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
            <HStack spacing={6}>
              <Image
                src={stockData.image_url}
                alt={stockData.name}
                boxSize="120px"
                objectFit="contain"
              />
              <VStack align="start" spacing={2}>
                <Heading size="xl" color={textColor}>
                  {stockData.name}
                </Heading>
                <HStack>
                  <Badge colorScheme="blue" fontSize="md">
                    {stockData.ticker}
                  </Badge>
                  <Badge colorScheme="green" fontSize="md">
                    {stockData.sector.title}
                  </Badge>
                </HStack>
              </VStack>
            </HStack>
          </Box>

          <HStack spacing={4} justify="space-between">
            {[
              { label: 'Текущая цена', value: formatCurrency(stockData.current_price) },
              { label: 'Страна', value: stockData.country_of_risk },
              { label: 'Количество', value: stockData.quantity },
            ].map((item, index) => (
              <Box
                key={index}
                bg="white"
                p={6}
                borderRadius="xl"
                boxShadow="sm"
                flex={1}
                height="100px"
              >
                <Stat
                  height="100%"
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                >
                  <StatLabel fontSize="md" color="gray.500">
                    {item.label}
                  </StatLabel>
                  <StatNumber fontSize="2xl" fontWeight="bold">
                    {item.value}
                  </StatNumber>
                  {item.subtext && <StatHelpText>{item.subtext}</StatHelpText>}
                </Stat>
              </Box>
            ))}
          </HStack>

          <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
            <Heading size="lg" mb={6}>
              График дивидендов
            </Heading>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: textColor, fontSize: 12 }}
                  axisLine={{ stroke: gridColor }}
                  tickLine={{ stroke: gridColor }}
                  tickFormatter={(value) => new Date(value).getFullYear()}
                />
                <YAxis
                  domain={['dataMin', 'dataMax']}
                  tick={{ fill: textColor, fontSize: 12 }}
                  axisLine={{ stroke: gridColor }}
                  tickLine={{ stroke: gridColor }}
                  tickFormatter={(value) => value.toFixed(1)}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={averageAmount} stroke={gridColor} strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke={lineColor}
                  strokeWidth={2}
                  dot={{ fill: lineColor, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>

          <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
            <Heading size="lg" mb={6}>
              Детали дивидендов
            </Heading>
            <DividendDetailsTable
              dividends={sortedDividends()}
              handleRequestSort={handleRequestSort}
              orderBy={orderBy}
              order={order}
            />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default StockDetails;