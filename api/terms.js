import postgres from 'pg'
const { Pool } = postgres;

import "urlpattern-polyfill";

const pool = new Pool()
const pattern = new URLPattern({ pathname: '/api/terms/:wallet' });

export default async function (request, response) {
    if (!pattern.test(request.url)) {
        return response.status(400).send('Bad Request');
    }

    const result = pattern.exec(request.url);
    const wallet = result.pathname.groups.wallet;

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