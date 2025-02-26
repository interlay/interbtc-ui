import { Alert, Flex, P } from "@/component-library";
import { StyledCloseCTA } from "@/component-library/Dialog/Dialog.style";
import { LocalStorageKey,useLocalStorage } from "@/hooks/use-local-storage";
import { StyledXMark } from "@/pages/Wallet/WalletOverview/components/WelcomeBanner/WelcomeBanner.styles";

const AppAlert = (): JSX.Element => {
  const [isAlertOpen, setIsAlertOpen] = useLocalStorage(LocalStorageKey.APP_ALERT_BANNER, true);

  return (
    <>
      {isAlertOpen && (
        <Flex>
          <Alert style={{ borderLeft: 0, borderRight: 0, borderTop: 0, borderRadius: 0, width: '100%' }} status='info'>
            <P size='s'>Ledger is not supported on Interlay. Please don&apos;t use Ledger to store your tokens.</P>
          </Alert>
          <StyledCloseCTA size='small' variant='text' aria-label='dimiss ledger alert banner' onPress={() => setIsAlertOpen(false)}>
            <StyledXMark />
          </StyledCloseCTA>
        </Flex>
      )}
    </>
  );};

export { AppAlert };
