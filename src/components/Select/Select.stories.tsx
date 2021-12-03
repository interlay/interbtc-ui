
import * as React from 'react';
import {
  Story,
  Meta
} from '@storybook/react';
import clsx from 'clsx';

import Select, {
  SelectProps,
  SelectLabel,
  SelectButton,
  SelectOptions,
  SelectOption,
  SelectBody,
  SelectCheck,
  SelectText
} from './';

const people = [
  {
    id: 1,
    name: 'Wade Cooper',
    avatar:
      // eslint-disable-next-line max-len
      'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 2,
    name: 'Arlene Mccoy',
    avatar:
      // eslint-disable-next-line max-len
      'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 3,
    name: 'Devon Webb',
    avatar:
      // eslint-disable-next-line max-len
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80'
  },
  {
    id: 4,
    name: 'Tom Cook',
    avatar:
      // eslint-disable-next-line max-len
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 5,
    name: 'Tanya Fox',
    avatar:
      // eslint-disable-next-line max-len
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 6,
    name: 'Hellen Schmidt',
    avatar:
      // eslint-disable-next-line max-len
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 7,
    name: 'Caroline Schultz',
    avatar:
      // eslint-disable-next-line max-len
      'https://images.unsplash.com/photo-1568409938619-12e139227838?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 8,
    name: 'Mason Heaney',
    avatar:
      // eslint-disable-next-line max-len
      'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 9,
    name: 'Claudie Smitham',
    avatar:
      // eslint-disable-next-line max-len
      'https://images.unsplash.com/photo-1584486520270-19eca1efcce5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 10,
    name: 'Emil Schaefer',
    avatar:
      // eslint-disable-next-line max-len
      'https://images.unsplash.com/photo-1561505457-3bcad021f8ee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
];

const Template: Story<SelectProps> = args => {
  const [value, setValue] = React.useState(people[3]);

  const handleChange = (newValue: any) => {
    setValue(newValue);
  };

  return (
    <Select
      {...args}
      value={value}
      onChange={handleChange}>
      {({ open }) => (
        <>
          <SelectLabel>
            Assigned to
          </SelectLabel>
          <SelectBody>
            <SelectButton>
              <span
                className={clsx(
                  'flex',
                  'items-center',
                  'space-x-3'
                )}>
                <img
                  src={value.avatar}
                  alt=''
                  className={clsx(
                    'flex-shrink-0',
                    'h-6',
                    'w-6',
                    'rounded-full'
                  )} />
                <SelectText>
                  {value.name}
                </SelectText>
              </span>
            </SelectButton>
            <SelectOptions open={open}>
              {people.map(person => (
                <SelectOption
                  key={person.id}
                  value={person}>
                  {({
                    selected,
                    active
                  }) => (
                    <>
                      <div
                        className={clsx(
                          'flex',
                          'items-center',
                          'space-x-3'
                        )}>
                        <img
                          src={person.avatar}
                          alt=''
                          className={clsx(
                            'flex-shrink-0',
                            'h-6',
                            'w-6',
                            'rounded-full'
                          )} />
                        <SelectText selected={selected}>
                          {person.name}
                        </SelectText>
                      </div>
                      {selected ? (
                        <SelectCheck active={active} />
                      ) : null}
                    </>
                  )}
                </SelectOption>
              ))}
            </SelectOptions>
          </SelectBody>
        </>
      )}
    </Select>
  );
};

const Default = Template.bind({});
Default.args = {};

export {
  Default
};

export default {
  title: 'Select',
  component: Select
} as Meta;
