import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { OVIdViewer, OVIdViewerProps } from "../index";

export default {
  title: "OVIdViewer",
  component: OVIdViewer,
} as Meta<typeof OVIdViewer>;

const Template: StoryFn<OVIdViewerProps> = (args) => <OVIdViewer {...args} />;

export const Default = Template.bind({});
Default.args = {
  did: "did:cheqd:mainnet:280dd37c-aa96-5e71-8548-5125505a968e",
  title: "@originvault/ov-id-sdk",
  resourceTypes: [
    "NPM-Package-Publish-Event", 
    "Working-Directory-Derived-Key"
  ],
}; 