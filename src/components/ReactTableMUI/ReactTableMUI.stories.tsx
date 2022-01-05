import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import { Story } from "@storybook/react";
import ReactTableMUI from ".";

export default {
  title: "Components/Table",
  component: ReactTableMUI,
  
} as Meta;

// Create a master template for mapping args to render the component
const Template: Story<any> = (args) => <ReactTableMUI {...args} />;

// Reuse that template for creating different stories
export const Primary = Template.bind({});

