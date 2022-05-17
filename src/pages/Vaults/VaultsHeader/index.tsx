import PageTitle from 'parts/PageTitle';
import TimerIncrement from 'parts/TimerIncrement';
import BoldParagraph from 'components/BoldParagraph';

interface VaultsHeaderProps {
  title: string;
  accountAddress: string;
}

const VaultsHeader = ({
  title,
  accountAddress
}: VaultsHeaderProps): JSX.Element => (
  <div>
    <PageTitle
      mainTitle={title}
      subTitle={<TimerIncrement />} />
    <BoldParagraph className='text-center'>
      {accountAddress}
    </BoldParagraph>
  </div>
);

export { VaultsHeader };
