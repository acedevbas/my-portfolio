// src/components/PortfolioCard.js
import React from 'react';
import { Card, CardBody, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Skeleton, useColorModeValue } from '@chakra-ui/react';

const PortfolioCard = ({ label, value, loading, isChange, change, changePercent }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Card bg={bgColor} shadow="md" borderRadius="lg" flex={1}>
      <CardBody>
        <Stat>
          <StatLabel color={textColor}>{label}</StatLabel>
          {loading ? (
            <Skeleton height="40px" width="100px" />
          ) : (
            <>
              <StatNumber color={textColor}>{value}</StatNumber>
              {isChange && (
                <StatHelpText>
                  <StatArrow type={change >= 0 ? 'increase' : 'decrease'} />
                  {changePercent}%
                </StatHelpText>
              )}
            </>
          )}
        </Stat>
      </CardBody>
    </Card>
  );
};

export default PortfolioCard;