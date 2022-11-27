it("should visit app, and login with neovim email", () => {
  const title = new Date().toISOString();
  cy.visit("http://localhost:3000");

  cy.get("a").contains("Home");
  cy.get("a#loginButton").click();
  cy.url().should("eq", "http://localhost:3000/login");

  cy.get('[data-test="Email"]').type("neovim@email.com");
  cy.get('[data-test="Password"]').type("neovim");
  cy.get("button").click();

  cy.get("#logoutButton").should("exist");
  cy.url().should("eq", "http://localhost:3000/");

  const titleInput = cy.get('[data-test="insert thread title"]');
  const bodyInput = cy.get('[data-test="insert thread body/content"]');
  const categoryInput = cy.get('[data-test="insert thread category"]');

  titleInput.type(title);
  bodyInput.type("New thread body from cypress");
  categoryInput.type("cypress");

  cy.get("button").contains("Post Thread").click();

  titleInput.should("not.contain.value");
  bodyInput.should("not.contain.value");
  categoryInput.should("not.contain.value");

  cy.get("article a").first().should("contain", title);
  cy.get("article p").first().should("contain", "New thread body from cypress");
  cy.get("article section").last().get("span").should("contain", "cypress");
});
