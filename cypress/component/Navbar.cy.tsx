import "../../src/index.css";
import Navbar from "../../src/components/Navbar";
import { getStore } from "../../src/states";
import {
  clearAuth,
  setAuthToken,
  setAuthUser,
} from "../../src/states/auth/actions";

const fakeUser = {
  id: "fake-1",
  name: "fake user",
  avatar: "avatar_link",
};

describe("Navbar.cy.ts", () => {
  it("should show logout button and should not show login button", () => {
    const store = getStore();

    store.dispatch(setAuthUser(fakeUser));
    store.dispatch(setAuthToken("faketoken"));

    cy.mount(<Navbar />, { reduxStore: store });
    cy.get("#loginButton").should("not.exist");
    cy.get("#logoutButton").should("exist");
  });

  it("should show login button and should not show logout button", () => {
    const store = getStore();

    cy.mount(<Navbar />, { reduxStore: store });
    cy.get("#loginButton").should("exist");
    cy.get("#logoutButton").should("not.exist");
  });

  it("should logout and show login button", () => {
    const store = getStore();

    store.dispatch(setAuthUser(fakeUser));
    store.dispatch(setAuthToken("faketoken"));

    cy.mount(<Navbar />, { reduxStore: store });

    await cy.get("#logoutButton").click();
    cy.get("#loginButton").should("exist");
  });

  it("should show login, set auth user and then show logout", async () => {
    const store = getStore();
    cy.mount(<Navbar />, { reduxStore: store });
    await cy.get("#loginButton").should("exist");

    store.dispatch(setAuthUser(fakeUser));
    store.dispatch(setAuthToken("faketoken"));

    cy.get("#logoutButton").should("exist");
  });
});
