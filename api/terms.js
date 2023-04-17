import { cryptoWaitReady, signatureVerify } from "@polkadot/util-crypto";
import postgres from 'pg'
const { Pool } = postgres;

// const MESSAGE = "KINTSUGI_TERMS_AND_CONDITIONS_LINK";

const pool = new Pool({
  connectionTimeoutMillis: 3000,
  ssl: {
    rejectUnauthorized: false
  }
})

const pattern = /\/terms\/(?<wallet>\w+)/;

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

const terms = async (request, response) => {
  if (!pattern.test(request.url)) {
    return response.status(400).send('Bad Request');
  }

  const wallet = request.url.match(pattern).groups.wallet;

  if (request.method === 'GET') {
    const result = await pool.query('select exists(select 1 from signed_terms where wallet_id=$1)', [wallet])
    return response.send(result.rows[0]);
  } else if (request.method === 'POST') {
    try {
      // TODO: verify signature
      // const { signed_message } = JSON.parse(request.body);
      // const { isValid } = signatureVerify(MESSAGE, signed_message, wallet);

      const result = await pool.query('insert into signed_terms (wallet_id) values ($1)', [wallet])
      return response.status(201);
    } catch (error) {
      if (error.code === '23505') {
        return response.status(200).send('Already signed');
      }
      console.log(error);
      return response.status(400).send('Bad Request');
    }
  }
  return response.status(400).send('Bad Request');
}

export default async function (request, response) {
  return allowCors(terms)(request, response);
}
