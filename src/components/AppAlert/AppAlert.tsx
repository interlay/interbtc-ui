import { XMark } from "@/assets/icons";
import { Alert, Flex, P } from "@/component-library";
import { LocalStorageKey,useLocalStorage } from "@/hooks/use-local-storage";

import { StyledCloseCTA } from "./AppAlert.styles";

type Props = {
  alertText: string
}

const AppAlert = ({ alertText }: Props): JSX.Element => {
  const [isAlertOpen, setIsAlertOpen] = useLocalStorage(LocalStorageKey.APP_ALERT_BANNER, true);

  return (
    <>
      {isAlertOpen && (
        <Flex>
          <Alert style={{ borderLeft: 0, borderRight: 0, borderTop: 0, borderRadius: 0, width: '100%' }} status='info'>
            <P size='s'>{alertText}</P>
          </Alert>
          <StyledCloseCTA style={{ top: 0 }} size='small' variant='text' aria-label='dimiss ledger alert banner' onPress={() => setIsAlertOpen(false)}>
            <XMark />
          </StyledCloseCTA>
        </Flex>
      )}
    </>
  );};

export { AppAlert };
