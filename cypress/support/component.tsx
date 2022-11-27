/// <reference types="cypress" />
// Import commands.js using ES2015 syntax:
import "./commands";
import { mount } from "cypress/react18";
import { MountOptions, MountReturn } from "cypress/react";
import { Provider } from "react-redux";
import { EnhancedStore } from "@reduxjs/toolkit";
import { RootState, getStore } from "../../src/states/index";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Mounts a React node
       * @param component React Node to mount
       * @param options Additional options to pass into mount
       */
      mount(
        component: React.ReactNode,
        options?: MountOptions & { reduxStore?: EnhancedStore<RootState> }
      ): Cypress.Chainable<MountReturn>;
    }
  }
}

Cypress.Commands.add("mount", (component, options = {}) => {
  // Use the default store if one is not provided
  const { reduxStore = getStore(), ...mountOptions } = options;

  const wrapped = <Provider store={reduxStore}>{component}</Provider>;

  return mount(wrapped, mountOptions);
});
