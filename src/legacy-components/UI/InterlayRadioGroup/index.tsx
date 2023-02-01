import { RadioGroup } from '@headlessui/react';
import clsx from 'clsx';
import * as React from 'react';

const PLANS = [
  {
    name: 'Hobby',
    ram: '8GB',
    cpus: '4 CPUs',
    disk: '160 GB SSD disk',
    price: '$40'
  },
  {
    name: 'Startup',
    ram: '12GB',
    cpus: '6 CPUs',
    disk: '256 GB SSD disk',
    price: '$80'
  },
  {
    name: 'Business',
    ram: '16GB',
    cpus: '8 CPUs',
    disk: '512 GB SSD disk',
    price: '$160'
  },
  {
    name: 'Enterprise',
    ram: '32GB',
    cpus: '12 CPUs',
    disk: '1024 GB SSD disk',
    price: '$240'
  }
];

// TODO: not used for now
const InterlayRadioGroup = (): JSX.Element => {
  const [selected, setSelected] = React.useState(PLANS[0]);

  return (
    <RadioGroup value={selected} onChange={setSelected}>
      <RadioGroup.Label className='sr-only'>Server size</RadioGroup.Label>
      <div className='space-y-4'>
        {PLANS.map((item) => (
          <RadioGroup.Option
            key={item.name}
            value={item}
            className={({ active }) =>
              clsx(
                {
                  [clsx('ring-1', 'ring-offset-2', 'ring-indigo-500')]: active
                },
                'relative',
                'block',
                'rounded-lg',
                'border',
                'border-gray-300',
                'bg-white',
                'shadow-sm',
                'px-6',
                'py-4',
                'cursor-pointer',
                'hover:border-gray-400',
                'sm:flex',
                'sm:justify-between',
                'focus:outline-none'
              )
            }
          >
            {({ checked }) => (
              <>
                <div className={clsx('flex', 'items-center')}>
                  <div className='text-sm'>
                    <RadioGroup.Label as='p' className={clsx('font-medium', 'text-gray-900')}>
                      {item.name}
                    </RadioGroup.Label>
                    <RadioGroup.Description as='div' className='text-gray-500'>
                      <p className='sm:inline'>
                        {item.ram} / {item.cpus}
                      </p>{' '}
                      <span className='hidden sm:inline sm:mx-1' aria-hidden='true'>
                        &middot;
                      </span>{' '}
                      <p className='sm:inline'>{item.disk}</p>
                    </RadioGroup.Description>
                  </div>
                </div>
                <RadioGroup.Description
                  as='div'
                  className={clsx('mt-2', 'flex', 'text-sm', 'sm:mt-0', 'sm:block', 'sm:ml-4', 'sm:text-right')}
                >
                  <div className={clsx('font-medium', 'text-gray-900')}>{item.price}</div>
                  <div className={clsx('ml-1', 'text-gray-500', 'sm:ml-0')}>/mo</div>
                </RadioGroup.Description>
                <div
                  className={clsx(
                    checked ? 'border-indigo-500' : 'border-transparent',
                    'absolute',
                    '-inset-px',
                    'rounded-lg',
                    'border-2',
                    'pointer-events-none'
                  )}
                  aria-hidden='true'
                />
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
};

export default InterlayRadioGroup;
