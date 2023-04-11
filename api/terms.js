import postgres from 'pg'
const { Pool } = postgres;

const pool = new Pool()

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
      const result = await pool.query('insert into signed_terms (wallet_id) values ($1)', [wallet])
      return response.status(201);
    } catch (error) {
      console.log(error);
      return response.status(400).send('Bad Request');
    }
  }
  return response.status(400).send('Bad Request');
}

export default async function(request, response) {
  return allowCors(terms)(request, response);
}
