Cypress.Commands.add('fillSignupFormAndSubmit', (email, password) => {
  cy.visit('/signup')
  cy.get('#email').type(email)
  cy.get('#password').type(password, { log: false })
  cy.get('#confirmPassword').type(password, { log: false })
  cy.contains('button', 'Signup').click()
  cy.get('#confirmationCode').should('be.visible')
})

Cypress.Commands.add('login', (
  email = Cypress.env('USER_EMAIL'),
  password = Cypress.env('USER_PASSWORD'),
  { cacheSession = true } = {}
) => {

  const login = () => {
    cy.visit('/login')
    cy.get('#email').type(email)
    cy.get('#password').type(password, { log: false })
    cy.get('.LoaderButton').click()
    cy.contains('h1', 'Your Notes').should('be.visible')
  }
  if (cacheSession) {
    cy.session([email, password], login)
  } else {
    login()
  }
})

const attachFileHandler = () => cy.get('#file').attachFile('example.json')

Cypress.Commands.add('createNote', (noteDescription, attachFile = false) => {
  cy.visit('/notes/new')
  cy.get('#content').type(noteDescription)

  if (attachFile) {
    attachFileHandler()
  }

  cy.get('.LoaderButton').click()
  cy.contains('.list-group-item', noteDescription).should('be.visible')
})

Cypress.Commands.add('editNote', (noteDescription, noteDescriptionNew, attachFile = false) => {
  cy.intercept('GET', '**/notes/**').as('getNote')

  cy.contains('.list-group-item', noteDescription).click()
  cy.wait('@getNote')

  cy.get('#content')
    .clear()
    .type(noteDescriptionNew)

  if (attachFile) {
    attachFileHandler()
  }

  cy.contains('button', 'Save').click()

  cy.contains('.list-group-item', noteDescription).should('not.exist')
  cy.contains('.list-group-item', noteDescriptionNew).should('be.visible')
})

Cypress.Commands.add('deleteNote', note => {
  cy.contains('.list-group-item', note).click()
  cy.contains('button', 'Delete').click()

  cy.contains('.list-group-item', note).should('not.exist')
})

Cypress.Commands.add('fillSettingsFormAndSubmit', () => {
  cy.visit('/settings')
  cy.get('#storage').type('1')
  cy.get('#name').type('Mary Doe')
  cy.iframe('.card-field iframe')
    .as('iframe')
    .find('[name="cardnumber"]')
    .type('4242424242424242')
  cy.get('@iframe')
    .find('[name="exp-date"]')
    .type('1271')
  cy.get('@iframe')
    .find('[name="cvc"]')
    .type('123')
  cy.get('@iframe')
    .find('[name="postal"]')
    .type('12345')
  cy.contains('button', 'Purchase').click()
})

Cypress.Commands.add('logout', note => {
  if (Cypress.config('viewportWidth') < Cypress.env('viewportWidthBreakpoint')) {
    cy.get('.navbar-toggle.collapsed')
      .should('be.visible')
      .click()
  }
  /* ==== Generated with Cypress Studio ==== */
  cy.get('.nav > :nth-child(2) > a').click();
  cy.get('#email').should('be.visible');
})