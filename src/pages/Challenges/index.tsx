import {
  useState,
  useEffect,
  ReactElement,
  useMemo
} from 'react';
import { useSelector } from 'react-redux';
import {
  Image,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  Tab,
  Tabs
} from 'react-bootstrap';
import {
  useTranslation,
  TFunction
} from 'react-i18next';
import {
  RelayerData,
  VaultData
} from '@interlay/polkabtc-stats';

import MainContainer from 'parts/MainContainer';
import { StoreType } from 'common/types/util.types';
import DashboardTable from 'common/components/dashboard-table/dashboard-table';
import usePolkabtcStats from 'common/hooks/use-polkabtc-stats';
import TimerIncrement from 'common/components/timer-increment';
import { CHALLENGE_1_START } from '../../constants'; // relative path due to conflict
import newImg from 'assets/img/icons/new.png';
import 'pages/dashboard/dashboard-subpage.scss';
import './challenges.scss';

const CHALLENGE_CUTOFFS = [
  0, // all time
  CHALLENGE_1_START
];

type ChallengeSelectorProps = {
  challengeIdx: number;
  setChallengeIdx: (idx: number) => void;
  t: TFunction;
}

function ChallengeSelector({ challengeIdx, setChallengeIdx, t }: ChallengeSelectorProps): ReactElement {
  return (
    <ToggleButtonGroup
      className='mt-4 mx-3'
      type='radio'
      value={challengeIdx}
      name='challenge'
      onChange={val => setChallengeIdx(val)}>
      <ToggleButton
        variant='outline-primary'
        value={0}>
        {t('leaderboard.all_time')}
      </ToggleButton>
      <ToggleButton
        variant='outline-primary'
        value={1}>
        {t('leaderboard.challenge')}
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

function Challenges(): ReactElement {
  // eslint-disable-next-line no-array-constructor
  const [vaultRows, setVaultRows] = useState(new Array<VaultData>());
  // eslint-disable-next-line no-array-constructor
  const [relayerRows, setRelayerRows] = useState(new Array<RelayerData>());
  const [challengeIdx, setChallengeIdx] = useState(0); // all time

  const statsApi = usePolkabtcStats();
  const { polkaBtcLoaded } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();

  const vaultTableHeadings = [
    <h1>{t('leaderboard.account_id')}</h1>,
    <h1>{t('leaderboard.collateral')}</h1>,
    <h1>{t('leaderboard.request_issue_count')}</h1>,
    <h1>{t('leaderboard.execute_issue_count')}</h1>,
    <h1>{t('leaderboard.request_redeem_count')}</h1>,
    <h1>{t('leaderboard.execute_redeem_count')}</h1>,
    <h1>{t('leaderboard.lifetime_sla')}</h1>
  ];

  // TODO:
  // - exclude Interlay owned vaults
  // - sort vaults with highest lifetime sla
  const tableVaultRow = useMemo(
    () => (row: VaultData): ReactElement[] => [
      <p>{row.id}</p>,
      <p>{row.collateral} DOT</p>,
      <p>{row.request_issue_count}</p>,
      <p>{row.execute_issue_count}</p>,
      <p>{row.request_redeem_count}</p>,
      <p>{row.execute_redeem_count}</p>,
      <p>{Number(row.lifetime_sla).toFixed(2)}</p>
      // lifetime_sla is a string despite schema being "number"
      // TODO: check how Axios/openapi-generator handle typings, and if necessary
      // convert stats API data types to `string` to avoid confusion
    ],
    []
  );

  const relayerTableHeadings = [
    <h1>{t('leaderboard.account_id')}</h1>,
    <h1>{t('leaderboard.stake')}</h1>,
    <h1>{t('leaderboard.block_count')}</h1>,
    <h1>{t('leaderboard.lifetime_sla')}</h1>
  ];

  // TODO:
  // - exclude Interlay owned relayers
  // - sort relayers with highest lifetime sla
  const tableRelayerRow = useMemo(
    () => (row: RelayerData): ReactElement[] => [
      <p>{row.id}</p>,
      <p>{row.stake} DOT</p>,
      <p>{row.block_count}</p>,
      <p>{Number(row.lifetime_sla).toFixed(2)}</p>
    ],
    []
  );

  useEffect(() => {
    const fetchVaultData = async () => {
      if (!polkaBtcLoaded) return;
      const vaults = (await statsApi.getVaults(CHALLENGE_CUTOFFS[challengeIdx])).data;
      setVaultRows(vaults.sort((a, b) => b.lifetime_sla - a.lifetime_sla));
    };

    const fetchRelayerData = async () => {
      if (!polkaBtcLoaded) return;
      const relayers = (await statsApi.getRelayers(CHALLENGE_CUTOFFS[challengeIdx])).data;
      setRelayerRows(relayers.sort((a, b) => b.lifetime_sla - a.lifetime_sla));
    };

    fetchVaultData();
    fetchRelayerData();
  }, [polkaBtcLoaded, statsApi, challengeIdx, t]);

  return (
    <MainContainer>
      <div className='dashboard-container dashboard-fade-in-animation dashboard-min-height'>
        <div className='dashboard-wrapper'>
          <div className='title-container'>
            <div className='title-text-container'>
              <h1 className='title-text'>{t('leaderboard.challenges_title')}</h1>
            </div>
          </div>
          <div className='row mt-3'>
            <div className='col-lg-4 mb-3'>
              <Card
                className='text-center'
                style={{ minHeight: '100px' }}>
                <h2>{t('leaderboard.challenges.treasure_hunt')}
                  <Image
                    src={newImg}
                    height='20em'
                    width='20em'>
                  </Image>
                </h2>
                <Card.Body>
                  {t('leaderboard.challenges.treasure_hunt_desc')}
                  <br />
                  <a
                    className='link'
                    href='https://docs.polkabtc.io/#/start/beta?id=treasure-hunt-500-dot'
                    target='_blank'
                    rel='noopener noreferrer'>
                    {t('leaderboard.more_info')} <span className='fa fa-external-link'></span>{' '}
                  </a>
                </Card.Body>
              </Card>
            </div>
            <div className='col-lg-4 mb-3'>
              <Card
                className='text-center'
                style={{ minHeight: '100px' }}>
                <h2>{t('leaderboard.challenges.vault_treasure_hunt')}</h2>
                <Card.Body>
                  {t('leaderboard.challenges.vault_treasure_hunt_desc')}
                  <br />
                  <br />
                </Card.Body>
              </Card>
            </div>
            <div className='col-lg-4 mb-3'>
              <Card
                className='text-center'
                style={{ minHeight: '100px' }}>
                <h2>{t('leaderboard.challenges.relayer_treasure_hunt')}</h2>
                <Card.Body>
                  {t('leaderboard.challenges.relayer_treasure_hunt_desc')}
                  <br />
                  <br />
                </Card.Body>
              </Card>
            </div>
          </div>
          <div className='row mt-3'>
            <div className='col-lg-4 offset-lg-2 mb-3'>
              <Card
                className='text-center'
                style={{ minHeight: '100px' }}>
                <h2>{t('leaderboard.challenges.vaults_relayers')}</h2>
                <Card.Body>
                  {t('leaderboard.challenges.vaults_relayers_desc')}
                </Card.Body>
              </Card>
            </div>
            <div className='col-lg-4 mb-3'>
              <Card
                className='text-center'
                style={{ minHeight: '100px' }}>
                <h2>{t('leaderboard.challenges.lottery')}</h2>
                <Card.Body>
                  {t('leaderboard.challenges.lottery_desc')}
                </Card.Body>
              </Card>
            </div>
          </div>
          <div className='title-container'>
            <div className='title-text-container'>
              <h1 className='title-text'>{t('leaderboard.title')}</h1>
              <p className='latest-block-text'>
                <TimerIncrement></TimerIncrement>
              </p>
            </div>
          </div>
          <Tabs>
            <Tab
              eventKey='vaults'
              title={t('leaderboard.vault_scores')}>
              <ChallengeSelector {...{ challengeIdx, setChallengeIdx, t }} />
              <div className='dashboard-table-container'>
                <DashboardTable
                  pageData={vaultRows}
                  headings={vaultTableHeadings}
                  dataPointDisplayer={tableVaultRow}
                  noDataEl={<td colSpan={6}>{t('loading_ellipsis')}</td>} />
              </div>
            </Tab>
            <Tab
              eventKey='relayers'
              title={t('leaderboard.relayer_scores')}>
              <ChallengeSelector {...{ challengeIdx, setChallengeIdx, t }} />
              <div className='dashboard-table-container'>
                <DashboardTable
                  pageData={relayerRows}
                  headings={relayerTableHeadings}
                  dataPointDisplayer={tableRelayerRow}
                  noDataEl={<td colSpan={6}>{t('loading_ellipsis')}</td>} />
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </MainContainer>
  );
}

export default Challenges;
