/// <reference types="cypress" />
import testFund from '../../test';

describe('Test spec', () => {
  beforeEach(() => {
    cy.task('generateAccount').then(value => console.log(value));

    cy.intercept('GET', 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,kusama,kintsugi&vs_currencies=usd', {
      statusCode: 200,
      body: { bitcoin: { usd: 35348 }, kintsugi: { usd: 13.52 }, kusama: { usd: 106.92 } }
    }).as('coinGecko');

    cy.visit('/transfer');
  });

  it('checks for extension', () => {
    const bool = true;
    expect(bool).to.be.true;
  });

  it('has an account seed', () => {
    console.log('seed', Cypress.env('seed'));
    console.log('env', process.env);
    expect(Cypress.env('seed')).to.be.a('string');
  });

  it('funds the account', () => {
    testFund();
    console.log('seed', Cypress.env('seed'));
    console.log('env', process.env);
    expect(Cypress.env('seed')).to.be.a('string');
  });
});
