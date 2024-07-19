import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useToast,
  VStack,
  Text,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { InfoIcon, CloseIcon } from '@chakra-ui/icons';
import axios from 'axios';

const TokenModal = ({ isOpen, onClose }) => {
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('http://192.168.1.129:5000/api/set_token', { token });
      if (response.status === 200) {
        toast({
          title: 'Токен установлен',
          description: 'Токен успешно установлен.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        onClose();
        window.location.reload();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось установить токен. Попробуйте еще раз.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={false} size="md">
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent bg={bgColor} borderRadius="xl" boxShadow="xl">
        <ModalHeader 
          borderBottomWidth="1px" 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center"
          color={textColor}
        >
          Установка токена
          <IconButton
            icon={<CloseIcon />}
            size="sm"
            onClick={onClose}
            aria-label="Close modal"
            variant="ghost"
          />
        </ModalHeader>
        <ModalBody py={6}>
          <VStack spacing={4} align="stretch">
            <Text fontSize="sm" color={textColor}>
              <InfoIcon mr={2} color="blue.500" />
              Введите ваш токен для доступа к API
            </Text>
            <Input
              placeholder="Введите токен"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              isDisabled={isSubmitting}
              size="lg"
              borderRadius="md"
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
            />
          </VStack>
        </ModalBody>
        <ModalFooter borderTopWidth="1px">
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            isDisabled={!token}
            size="lg"
            width="full"
            borderRadius="md"
            _hover={{ bg: 'blue.600' }}
          >
            Сохранить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TokenModal;