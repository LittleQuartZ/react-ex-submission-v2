import { ComponentStory, ComponentMeta } from "@storybook/react";
import Button from "../components/Button";
import "../index.css";

export default {
  title: "Button",
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Normal = Template.bind({});
Normal.args = {
  children: "This is a button",
  full: false,
};

export const Blue = Template.bind({});
Blue.args = {
  children: "This is blue button",
  color: "blue",
  full: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  children: "This is disabled button",
  disabled: true,
};
