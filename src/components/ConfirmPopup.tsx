import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  PseudoBox,
} from '@chakra-ui/core';
import { useRef, useState } from 'react';

export const ConfirmPopup = ({ title, body, onConfirm, children, color = 'red', actionText = 'Delete' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();
  const confirm = () => {
    onClose();
    onConfirm();
  };
  return (
    <>
      <PseudoBox onClick={() => setIsOpen(true)}>{children}</PseudoBox>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>{body}</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button variantColor={color} onClick={confirm} ml={3}>
              {actionText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
