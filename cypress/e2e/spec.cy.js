describe('entire test suite', () => {
 
  let user = {}

  beforeEach(() => {
    cy.fixture('example').then((user1) => {
      user = user1;
      cy.visit("/text-box");
    })
  })

  // Textbox: Fill the fields, submit and assert that everything works

  it("Filling out textbox fields", () => {
    cy.get("#userName")
      .should("be.visible")
      .type(user.name)
      .should('contain.value', user.name);

    cy.get("#userEmail")
      .should("be.visible")
      .type(user.email)
      .should('contain.value', user.email);

    cy.get("#currentAddress")
      .should("be.visible")
      .type(user.currentAddress)
      .should('contain.value', user.currentAddress);

    cy.get("#permanentAddress")
      .should("be.visible")
      .type(user.permanentAddress)
      .should('contain.value', user.permanentAddress);

    cy.get('#submit')
      .should("be.visible")
      .click();

    cy.get("#output #name").should('contain.text', user.name);
    cy.get("#output #email").should('contain.text', user.email)
    cy.get("#output #currentAddress").should('contain.text', user.currentAddress)
    cy.get("#output #permanentAddress").should('contain.text', user.permanentAddress)
  })

})

//Check box: Check any of the boxes and assert it is checked

describe("Check Box Page Test", () => {
  before(() => {
      cy.visit("/checkbox");
  })

  it("Checkbox check feature functionality", () => {
      cy.get("#tree-node > ol > li > span > button")
          .click()

      cy.get("#tree-node > ol > li > ol > li:nth-child(1) > span > button")
          .should("be.visible")
          .click()

      cy.get("#tree-node > ol > li > ol > li:nth-child(1) > ol > li:nth-child(2) > span > label")
          .click()
          .children("#tree-node-commands")
          .should("be.checked")

      cy.get("#result")
          .children("span:first-child")
          .should("contain.text", "You have selected :")

          .siblings("span:last-child")
          .should("contain.text", "commands")
  })
})

//Radio button: same as check box

describe("Radio Button Page", () => {
  before(() => {
      cy.visit("/radio-button");
  })

  it("Radio button toggle functionality", () => {
      cy.get("#app > div > div > div.row > div.col-12.mt-4.col-md-6 > div:nth-child(2) > div:nth-child(3)")
          .click()
          .children("#impressiveRadio")
          .should("be.checked");

      cy.get("#yesRadio").should("not.be.checked");
      cy.get("#noRadio").should("be.disabled");
  })
})

//Web Tables: fill the table and assert that the added row is saved
describe("Web Table Page", () => {
  let user = {}

  beforeEach(() => {
      cy.fixture('example').then((_user) => {
          user = _user
          cy.visit("/webtables");
      });
  })

  it("Adding user to table", () => {
      cy.get("#addNewRecordButton").click();

      cy.get("body > div.fade.modal.show > div > div").should("be.visible");

      cy.inputMassFill({
          "#firstName": user.firstName,
          "#lastName": user.lastName,
          "#userEmail": user.email,
          "#age": user.age,
          "#salary": user.salary,
          "#department": user.department,
      }, true)

      cy.get("#submit").click()

      cy.get(".rt-tbody .rt-tr-group[role='rowgroup']:nth-child(4) .rt-tr[role='row']").as("table-body")

      let data = [user.firstName, user.lastName, user.age, user.email, user.salary, user.department];
      for (let index = 1; index <= 6; index++) {
          let selector = `.rt-td[role='gridcell']:nth-child(${index})`;

          cy.get("@table-body")
              .find(selector)
              .should("contain.text", data[index - 1]);
      }
  })

  it("Updating user in table", () => {
      cy.get(".rt-tbody .rt-tr-group[role='rowgroup']:nth-child(3) .rt-tr[role='row']").as("table-body")
      cy.get("@table-body").find("#edit-record-3").click()

      cy.masInput({
          "#firstName": `${user.firstName}2`,
          "#lastName": `${user.lastName}2`,
          "#userEmail": `${user.email}m`,
          "#age": user.age,
          "#salary": `${user.salary}2`,
          "#department": `${user.department}2`,
      }, true)

      cy.get("#submit").click();

      let data_edited = [`${user.firstName}2`, `${user.lastName}2`, 26, `${user.email}m`, `${user.salary}2`, `${user.department}2`];
      for (let index = 1; index <= 6; index++) {
          let selector = `.rt-td[role='gridcell']:nth-child(${index})`;

          cy.get("@table-body")
              .find(selector)
              .should("contain.text", data_edited[index - 1]);
      }
  })

  it("Deleting user in table", () => {
      cy.get(".rt-tbody .rt-tr-group[role='rowgroup']:nth-child(3) .rt-tr[role='row']").as("table-body");
      cy.get("@table-body").find("#delete-record-3").click()

      for (let index = 1; index <= 6; index++) {
          let selector = `.rt-td[role='gridcell']:nth-child(${index})`;

          cy.get("@table-body")
              .find(selector)
              .contains(/[\w]+/)
              .should("not.exist");
      }
  })
})

//Buttons: Do as the button texts say. Add assertions after click
describe("Buttons", () => {
  before(() => {
      cy.visit("/buttons");
  })

  it("Double clicking button", () => {
      cy.get("#doubleClickBtn").dblclick();
      cy.get("#doubleClickMessage").should("have.text", "You have done a double click");

      cy.get("#rightClickBtn").rightclick();
      cy.get("#rightClickMessage").should("have.text", "You have done a right click");

      cy.get("button").contains(/^Click Me$/).click();
      cy.get("#dynamicClickMessage").should("have.text", "You have done a dynamic click");
  })
})

//Links: Check for links opening in same tab or in different tabs
describe("Valid links", () => {
  beforeEach(() => {
      cy.visit("/links")
  })

  it("Opening links in new tab", () => {
      cy.get('#simpleLink').should('have.attr', 'target', '_blank');
      cy.get('#dynamicLink').should('have.attr', 'target', '_blank');
  })

  it("Checking appropriate responses", () => {
      let links = {
          "created": 201,
          "no-content": 204,
          "moved": 301,
          "bad-request": 400,
          "unauthorized": 401,
          "forbidden": 403,
          "invalid-url": 404,
      }

      for (const id in links) {
          if (Object.hasOwnProperty.call(links, id)) {
              const statusCode = links[id];

              cy.intercept(`/${id}`).as(id);
              cy.get(`#${id}`).click();
              cy.wait(`@${id}`).its('response.statusCode').should('eq', statusCode)
          }
      }
  })
})

describe("Link Page Test - Broken links", () => {
  before(() => {
      cy.visit("/broken")
  })

  it("Opening broken", () => {
      cy.xpath("//*[@id=\"app\"]/div/div/div[2]/div[2]/div[2]/a[1]").each((element) => {
          cy.request(element.prop("href")).its('status').should('eq', 200)
      })

      cy.xpath("//*[@id=\"app\"]/div/div/div[2]/div[2]/div[2]/a[2]").each((element) => {
          cy.request({
              url: element.prop('href'),
              failOnStatusCode: false
          }).its("status").should("eq", 500)
      })
  })
})


//Upload and Download: upload and download a file and add assertions
function getPath(filename) {
  const path = require("path")

  const downloadsFolder = Cypress.config('downloadsFolder')
  return path.join(downloadsFolder, filename);
}

describe("File Upload and Download Page", () => {
  beforeEach(() => {
      cy.visit("/upload-download")
  })

  it("Downloading File", () => {
      cy.get("#downloadButton").click()
      const filename  = Cypress.$("#downloadButton").prop("download")
      
      cy.readFile(getPath(filename), 'binary', { timeout: 15000 })
          .should('exist')
          .should(buffer => expect(buffer.length).to.be.gt(100));
  })

  it("Uploading File", () => {
      cy.get('#uploadFile').selectFile(getPath('sampleFile.jpeg')).then(($input) => {
          const files = $input[0].files
      
          expect(files[0].name).to.eq('sampleFile.jpeg')
          expect(files[0].type).to.eq('image/jpeg')
        })
  })

})