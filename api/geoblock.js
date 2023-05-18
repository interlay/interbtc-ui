export const config = {
    runtime: 'edge',
};

const blockedCountries = [
    'AL',
    'BS',
    'BB',
    'BW',
    'KH',
    'KP',
    'GH',
    'JM',
    'MY',
    'MU',
    'MM',
    'NI',
    'ID',
    'IR',
    'AF',
    'PK',
    'CN',
    'PA',
    'AM',
    'GN',
    'IQ',
    'RW',
    'RS',
    'SY',
    'TH',
    'UG',
    'TZ',
    'US',
    'YE',
    'ZW'
];

function isGeoblocked(req) {
    // https://vercel.com/docs/concepts/edge-network/headers#x-vercel-ip-country
    const countryCode = req.headers.get('x-vercel-ip-country')
    return blockedCountries.includes(countryCode)
}

export default (req) => {
    return new Response(null, { status: isGeoblocked(req) ? 403 : 200 })
};