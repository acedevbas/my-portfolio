import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  IconButton,
  Heading,
  VStack,
  Text,
  Card,
  CardBody,
  useToast,
  Flex,
  Select,
  useColorModeValue
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import DividendGrid from './DividendGrid';
import TokenModal from './TokenModal';
import StockDetails from './StockDetails';
import { formatCurrency } from './utils';

const DividendCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [monthlyDividends, setMonthlyDividends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('title');
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const headingColor = useColorModeValue('gray.800', 'white');
  const totalBgColor = useColorModeValue('teal.500', 'teal.300');

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get('http://192.168.1.129:5000/api/get_token');
        if (response.data.message === "Token not found") {
          setIsTokenModalOpen(true);
        } else {
          fetchDividends();
        }
      } catch (error) {
        console.error('There was an error fetching the token!', error);
        if (error.response && error.response.data.message === "Token not found") {
          setIsTokenModalOpen(true);
        } else {
          toast({
            title: 'Ошибка',
            description: 'Произошла ошибка при получении токена, попробуйте позже.',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
        }
      }
    };

    fetchToken();
  }, [toast]);

  const fetchDividends = async () => {
    try {
      const response = await axios.get('http://192.168.1.129:5000/api/portfolio');
      if (response.status !== 200) {
        throw new Error(response.data.message || 'Unknown error');
      }
      const tickers = response.data.map(position => position.ticker).join(',');
      const detailResponse = await axios.get(`http://192.168.1.129:5000/api/positions?tickers=${tickers}`);
      if (detailResponse.status !== 200) {
        throw new Error(detailResponse.data.message || 'Unknown error');
      }
      const dividends = detailResponse.data.flatMap(position =>
        position.dividends.map(dividend => ({
          title: position.name,
          start: dividend.date,
          amount: dividend.amount * position.quantity,
          image: position.image_url,
          quantity: position.quantity,
          dividendYieldPercent: dividend.dividend_yield_percent,
          ticker: position.ticker
        }))
      );
      setEvents(dividends);
      updateMonthlyDividends(selectedMonth, dividends);
      setLoading(false);
    } catch (error) {
      console.error('There was an error fetching the dividends!', error);
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при получении данных, попробуйте позже.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      setLoading(false);
    }
  };

  const updateMonthlyDividends = (month, allEvents) => {
    const filtered = allEvents.filter(event => new Date(event.start).getMonth() === month);
    setMonthlyDividends(filtered);
  };

  const handleMonthChange = (direction) => {
    let newMonth = selectedMonth + direction;
    if (newMonth < 0) newMonth = 11;
    if (newMonth > 11) newMonth = 0;
    setSelectedMonth(newMonth);
    updateMonthlyDividends(newMonth, events);
  };

  const calculateTotalDividends = (dividends) => {
    if (dividends.length === 0) return "0.00";
    return dividends.reduce((total, dividend) => total + (parseFloat(dividend.amount) || 0), 0).toFixed(2);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedDividends = () => {
    return monthlyDividends.slice().sort((a, b) => {
      if (orderBy === 'amount' || orderBy === 'quantity' || orderBy === 'dividendYieldPercent') {
        return order === 'asc' ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy];
      } else {
        return order === 'asc'
          ? a[orderBy].localeCompare(b[orderBy])
          : b[orderBy].localeCompare(a[orderBy]);
      }
    });
  };

  const handleTokenModalClose = () => {
    setIsTokenModalOpen(false);
    window.location.reload();
  };

  const handleStockClick = (ticker) => {
    setSelectedStock(ticker);
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="container.xl" py={8}>
        {selectedStock ? (
          <StockDetails ticker={selectedStock} onBack={() => setSelectedStock(null)} />
        ) : (
          <VStack spacing={6} align="stretch">
            <Card bg={cardBgColor} shadow="md" borderRadius="lg">
              <CardBody>
                <Flex alignItems="center" justifyContent="space-between">
                  <IconButton
                    icon={<ChevronLeftIcon />}
                    onClick={() => handleMonthChange(-1)}
                    aria-label="Previous month"
                    variant="ghost"
                    size="lg"
                  />
                  <Flex direction="column" align="center">
                    <Heading size="lg" color={headingColor}>
                      Дивиденды
                    </Heading>
                    <Select 
                      value={selectedMonth} 
                      onChange={(e) => {
                        const newMonth = parseInt(e.target.value);
                        setSelectedMonth(newMonth);
                        updateMonthlyDividends(newMonth, events);
                      }}
                      variant="filled"
                      size="sm"
                      mt={2}
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i}>
                          {new Date(0, i).toLocaleString('ru', { month: 'long' })}
                        </option>
                      ))}
                    </Select>
                  </Flex>
                  <IconButton
                    icon={<ChevronRightIcon />}
                    onClick={() => handleMonthChange(1)}
                    aria-label="Next month"
                    variant="ghost"
                    size="lg"
                  />
                </Flex>
              </CardBody>
            </Card>

            <Card bg={cardBgColor} shadow="md" borderRadius="lg">
              <CardBody>
                <DividendGrid
                  sortedDividends={sortedDividends}
                  loading={loading}
                  handleRequestSort={handleRequestSort}
                  orderBy={orderBy}
                  order={order}
                  onStockClick={handleStockClick}
                />
              </CardBody>
            </Card>

            {monthlyDividends.length > 0 && !loading && (
              <Card bg={totalBgColor} color="white" shadow="md" borderRadius="lg">
                <CardBody>
                  <Flex alignItems="center" justifyContent="space-between">
                    <Text fontSize="xl" fontWeight="bold">Итого за месяц</Text>
                    <Text fontSize="2xl" fontWeight="bold">
                      {formatCurrency(parseFloat(calculateTotalDividends(monthlyDividends)))} ₽
                    </Text>
                  </Flex>
                </CardBody>
              </Card>
            )}
          </VStack>
        )}
      </Container>
      <TokenModal isOpen={isTokenModalOpen} onClose={handleTokenModalClose} />
    </Box>
  );
};

export default DividendCalendar;