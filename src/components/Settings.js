// src/components/Settings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Container, Heading, Input, Button, Text, useToast, Card, CardBody } from '@chakra-ui/react';

const Settings = () => {
  const [token, setToken] = useState('');
  const [currentToken, setCurrentToken] = useState('');
  const toast = useToast();

  useEffect(() => {
    axios.get('http://192.168.1.129:5000/api/get_token')
      .then(response => {
        if (response.data.token) {
          setCurrentToken(response.data.token);
        } else {
          setCurrentToken('');
        }
      })
      .catch(error => {
        console.error('Error fetching the token:', error);
        // Убираем показ ошибки на странице настроек
      });
  }, []);

  const handleTokenSubmit = () => {
    axios.post('http://192.168.1.129:5000/api/set_token', { token })
      .then(response => {
        toast({
          title: 'Успех',
          description: 'Токен успешно установлен.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        setCurrentToken(token);
      })
      .catch(error => {
        console.error('Error setting the token:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось установить токен, попробуйте позже.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      });
  };

  return (
    <Box minH="100vh" bg="gray.100">
      <Container maxW="container.md" py={8}>
        <Card>
          <CardBody>
            <Heading as="h2" size="xl" mb={6}>Настройки</Heading>
            <Box mb={4}>
              <Text fontWeight="bold">Текущий токен:</Text>
              <Text>{currentToken ? currentToken : 'Токен не установлен'}</Text>
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Новый токен:</Text>
              <Input
                placeholder="Введите новый токен"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </Box>
            <Button colorScheme="blue" onClick={handleTokenSubmit}>
              Установить токен
            </Button>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
};

export default Settings;