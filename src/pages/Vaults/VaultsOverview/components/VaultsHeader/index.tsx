import BoldParagraph from '@/legacy-components/BoldParagraph';
import PageTitle from '@/parts/PageTitle';
import TimerIncrement from '@/parts/TimerIncrement';

interface VaultsHeaderProps {
  title: string;
  accountAddress: string;
}

const VaultsHeader = ({ title, accountAddress }: VaultsHeaderProps): JSX.Element => (
  <div>
    <PageTitle mainTitle={title} subTitle={<TimerIncrement />} />
    <BoldParagraph className='text-center'>{accountAddress}</BoldParagraph>
  </div>
);

export { VaultsHeader };
