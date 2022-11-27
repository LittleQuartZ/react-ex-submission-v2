import "../../src/index.css";
import Button from "../../src/components/Button";

describe("Button.cy.ts", () => {
  it("should have children", () => {
    cy.mount(<Button>This is a button</Button>);

    cy.get("button").should("contain.text", "This is a button");
  });

  it("should trigger onclick", () => {
    const onClickSpy = cy.spy().as("onClickSpy");
    cy.mount(<Button onClick={onClickSpy}>Trigger</Button>);

    cy.get("button").should("contain.text", "Trigger").click();
    cy.get("@onClickSpy").should("have.been.calledOnce");
  });
});
