import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  VStack,
  ButtonGroup,
  Button,
  Heading,
  useToast,
  Card,
  CardBody,
  useColorModeValue,
  Flex,
  IconButton,
  Select
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import PortfolioCard from './PortfolioCard';
import PortfolioGrid from './PortfolioGrid';
import TokenModal from './TokenModal';
import { formatCurrency, formatChange, calculateDividends } from './utils';

const Portfolio = () => {
  const [positions, setPositions] = useState([]);
  const [positionDetails, setPositionDetails] = useState({});
  const [view, setView] = useState('today');
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('totalValue');
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const headingColor = useColorModeValue('gray.800', 'white');
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get('http://192.168.1.129:5000/api/get_token');
        if (response.data.message === "Token not found") {
          setIsTokenModalOpen(true);
        } else {
          fetchPortfolio();
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

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get('http://192.168.1.129:5000/api/portfolio');
      if (response.status !== 200) {
        throw new Error(response.data.message || 'Unknown error');
      }
      setPositions(response.data);

      const tickers = response.data.map(position => position.ticker).join(',');
      const detailResponse = await axios.get(`http://192.168.1.129:5000/api/positions?tickers=${tickers}`);
      if (detailResponse.status !== 200) {
        throw new Error(detailResponse.data.message || 'Unknown error');
      }
      const details = detailResponse.data.reduce((acc, detail) => {
        acc[detail.ticker] = detail;
        return acc;
      }, {});
      setPositionDetails(details);
      setLoading(false);
    } catch (error) {
      console.error('There was an error fetching the data!', error);
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

  const handleTokenModalClose = () => {
    setIsTokenModalOpen(false);
    window.location.reload();
  };

  const calculateTotalValue = () => {
    return positions.reduce((total, position) => {
      const details = positionDetails[position.ticker];
      if (!details) return total;
      return total + ((details.price || 0) * (details.quantity || 0));
    }, 0).toFixed(2);
  };

  const calculateTotalChange = () => {
    const totalChange = positions.reduce((total, position) => {
      const details = positionDetails[position.ticker];
      if (!details) return total;
      return total + (details.change || 0);
    }, 0);
    const totalValue = positions.reduce((total, position) => {
      const details = positionDetails[position.ticker];
      if (!details) return total;
      return total + ((details.price || 0) * (details.quantity || 0));
    }, 0);
    const totalChangePercent = totalValue > 0 ? (totalChange / totalValue) * 100 : 0;
    return { totalChange, totalChangePercent };
  };

  const calculateDailyChange = () => {
    const dailyChange = positions.reduce((total, position) => {
      const details = positionDetails[position.ticker];
      if (!details) return total;
      return total + (details.daily_change || 0);
    }, 0);
    const totalValue = positions.reduce((total, position) => {
      const details = positionDetails[position.ticker];
      if (!details) return total;
      return total + ((details.price || 0) * (details.quantity || 0));
    }, 0);
    const dailyChangePercent = totalValue > 0 ? (dailyChange / totalValue) * 100 : 0;
    return { dailyChange, dailyChangePercent };
  };

  const calculateTotalDividends = () => {
    return positions.reduce((total, position) => {
      const details = positionDetails[position.ticker];
      if (!details || !details.dividends) return total;
      const filteredDividends = details.dividends.filter(dividend => new Date(dividend.date).getFullYear() === currentYear);
      const { totalDividends } = filteredDividends.length ? calculateDividends(filteredDividends, details.quantity) : { totalDividends: 0 };
      return total + parseFloat(totalDividends || 0);
    }, 0).toFixed(2);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedPositions = () => {
    return positions.slice().sort((a, b) => {
      const detailsA = positionDetails[a.ticker];
      const detailsB = positionDetails[b.ticker];
      let valueA, valueB;

      switch (orderBy) {
        case 'totalValue':
          valueA = detailsA ? (detailsA.price || 0) * (detailsA.quantity || 0) : 0;
          valueB = detailsB ? (detailsB.price || 0) * (detailsB.quantity || 0) : 0;
          break;
        case 'totalDividends':
          valueA = detailsA ? parseFloat(calculateDividends(detailsA.dividends ? detailsA.dividends.filter(dividend => new Date(dividend.date).getFullYear() === currentYear) : [], detailsA.quantity || 0).totalDividends) || 0 : 0;
          valueB = detailsB ? parseFloat(calculateDividends(detailsB.dividends ? detailsB.dividends.filter(dividend => new Date(dividend.date).getFullYear() === currentYear) : [], detailsB.quantity || 0).totalDividends) || 0 : 0;
          break;
        default:
          valueA = detailsA ? detailsA[orderBy] || a[orderBy] : a[orderBy];
          valueB = detailsB ? detailsB[orderBy] || b[orderBy] : b[orderBy];
      }

      if (valueA < valueB) return order === 'asc' ? -1 : 1;
      if (valueA > valueB) return order === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const handleMonthChange = (direction) => {
    let newMonth = selectedMonth + direction;
    if (newMonth < 0) newMonth = 11;
    if (newMonth > 11) newMonth = 0;
    setSelectedMonth(newMonth);
  };

  const { totalChange, totalChangePercent } = calculateTotalChange();
  const { dailyChange, dailyChangePercent } = calculateDailyChange();
  const totalDividends = calculateTotalDividends();

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          <Flex justifyContent="space-between" gap={6}>
            <PortfolioCard
              label="Стоимость портфеля"
              value={formatCurrency(parseFloat(calculateTotalValue())) + " ₽"}
              loading={loading}
            />
            <PortfolioCard
              label={`Дивиденды за ${currentYear}`}
              value={totalDividends === "0.00" ? '—' : formatCurrency(parseFloat(totalDividends)) + " ₽"}
              loading={loading}
            />
            <PortfolioCard
              label={view === 'today' ? 'За сегодня' : 'За все время'}
              value={view === 'today' ? formatChange(dailyChange, dailyChangePercent, false) : formatChange(totalChange, totalChangePercent, false)}
              loading={loading}
              isChange
              change={view === 'today' ? dailyChange : totalChange}
              changePercent={view === 'today' ? dailyChangePercent.toFixed(2) : totalChangePercent.toFixed(2)}
            />
          </Flex>

          <ButtonGroup variant="outline" spacing={4}>
            <Button onClick={() => setView('today')} colorScheme={view === 'today' ? 'blue' : 'gray'}>
              За сегодня
            </Button>
            <Button onClick={() => setView('allTime')} colorScheme={view === 'allTime' ? 'blue' : 'gray'}>
              За все время
            </Button>
          </ButtonGroup>

          <Card bg={cardBgColor} shadow="md" borderRadius="lg">
            <CardBody>
              <PortfolioGrid
                positions={positions}
                positionDetails={positionDetails}
                sortedPositions={sortedPositions}
                handleRequestSort={handleRequestSort}
                orderBy={orderBy}
                order={order}
                view={view}
                loading={loading}
              />
            </CardBody>
          </Card>
        </VStack>
      </Container>
      <TokenModal isOpen={isTokenModalOpen} onClose={handleTokenModalClose} />
    </Box>
  );
};

export default Portfolio;