/// <reference types="cypress" />

import * as polkadotExtension from '@polkadot/extension-dapp';

describe('Transfer feature', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,kusama,kintsugi&vs_currencies=usd', {
      statusCode: 200,
      body: { bitcoin: { usd: 35348 }, kintsugi: { usd: 13.52 }, kusama: { usd: 106.92 } }
    }).as('coinGecko');

    cy.visit('/transfer');
  });

  it('checks for extension', () => {
    const web3Enable = cy.stub(polkadotExtension, 'web3Enable').as('web3Enable').returns(['polkadot-js']);

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(web3Enable).to.be.called;
  });
});
