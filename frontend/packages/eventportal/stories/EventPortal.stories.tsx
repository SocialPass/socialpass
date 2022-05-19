import React from 'react';
import { Meta, Story } from '@storybook/react';
import { EventPortal } from '../src';

const meta: Meta = {
  title: 'EventPortal',
  component: EventPortal,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<Props> = args => <EventPortal {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};
