import { ComponentStory, ComponentMeta } from "@storybook/react";

import InputBox from "../components/InputBox";
import "../index.css";

export default {
  title: "InputBox",
  component: InputBox,
} as ComponentMeta<typeof InputBox>;

const Template: ComponentStory<typeof InputBox> = (args) => (
  <InputBox {...args} />
);

export const Default = Template.bind({});
Default.args = {
  type: "text",
  placeholder: "This is a textbox",
};

export const Email = Template.bind({});
Email.args = {
  type: "email",
  placeholder: "This is an email box",
};

export const Textarea = Template.bind({});
Textarea.args = {
  asTextArea: true,
};

export const Indigo = Template.bind({});
Indigo.args = {
  color: "indigo",
};

export const Blue = Template.bind({});
Blue.args = {
  color: "blue",
};
