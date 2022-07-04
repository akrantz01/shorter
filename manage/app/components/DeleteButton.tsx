import { DeleteIcon } from '@chakra-ui/icons';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Code,
  useDisclosure,
} from '@chakra-ui/react';
import { useFetcher } from '@remix-run/react';
import { useRef } from 'react';

interface Props {
  slug: string;
}

export default function DeleteButton({ slug }: Props): JSX.Element {
  const fetcher = useFetcher();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const onDelete = () => {
    fetcher.submit({}, { method: 'delete' });
    onClose();
  };

  return (
    <>
      <Button
        variant="outline"
        colorScheme="red"
        rightIcon={<DeleteIcon />}
        onClick={onOpen}
        isLoading={fetcher.state !== 'idle'}
      >
        Delete
      </Button>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Delete short-link?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to delete <Code colorScheme="yellow">{slug}</Code>? All references to this link will
            become invalid.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Nevermind
            </Button>
            <Button colorScheme="red" onClick={onDelete} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
