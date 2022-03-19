import * as axios from 'axios';
import { cacheGet, cacheSet } from './cache';
const clientId = process.env.BIZZABO_CLIENT_ID;
const clientSecret = process.env.BIZZABO_CLIENT_SECRET;

const issuerBaseUrl = process.env.AUTH_SERVER;
const apiServer = process.env.API_SERVER;
const audience = 'https://api.bizzabo.com/api';

const getToken = async (accountId) => {
    const cacheKey = `token_${accountId}`;
    const token = await cacheGet(cacheKey);
    if (token && token.expiresAt > Date.now()) {
        console.log('Returning a cached token');
        return token.token;
    }
    try {
        const oauthPayload = {
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret,
            audience: audience,
            account_id: accountId,
        }

        if (process.env.NODE_ENV !== 'production') {
            oauthPayload.api_server = apiServer;
        }
    
        const resp = await axios.post(`${issuerBaseUrl}/oauth/token`, oauthPayload);

        // set expiry to the future and substract 5 minutes (300 sec) to be on the safe side
        const expiresAt = (Date.now() / 1000 + resp.data.expires_in - 300) * 1000;
        await cacheSet(cacheKey, { token: resp.data.access_token, expiresAt });
        return resp.data.access_token;
  
    } catch(error) {
        console.error(error);
        throw Error("Not Authorized");
    }
}

const getContacts = async (accountId, eventId) => {

    return await axios.get(`${apiServer}/v1/events/${eventId}/contacts?size=200`, {
        headers : {
            'Authorization': `Bearer ${await getToken(accountId)}`
        } 
    }); 
}

const getContact = async (accountId, eventId, contactId) => {

    return await axios.get(`${apiServer}/v1/events/${eventId}/contacts/${contactId}`, {
        headers : {
            'Authorization': `Bearer ${await getToken(accountId)}`
        } 
    }); 
}

/** PUBLIC METHODS **/

export const getContactsCached = async (accountId, eventId, cacheTime = 300) => {
    const cacheKey = `contacts_${eventId}`;
    const contactsCached = await cacheGet(cacheKey);
    if (contactsCached && contactsCached.expiresAt > Date.now()) {
        console.log(`Returning cached contacts for event ${eventId}`);
        return contactsCached.data;
    }

    const { error, data } = await getContacts(accountId, eventId);

    if (!error) {
        const expiresAt = (Date.now() / 1000 + cacheTime) * 1000;
        await cacheSet(cacheKey, { data: data, expiresAt });
    }

    return data;
}

export const getContactCached = async (accountId, eventId, contactId, cacheTime = 300) => {
    const cacheKey = `contact_${eventId}_${contactId}`;
    const contactsCached = await cacheGet(cacheKey);
    if (contactsCached && contactsCached.expiresAt > Date.now()) {
        console.log(`Returning cached contact ${contactId}`);
        return contactsCached.data;
    }

    const { error, data } = await getContact(accountId, eventId, contactId);

    if (!error) {
        const expiresAt = (Date.now() / 1000 + cacheTime) * 1000;
        await cacheSet(cacheKey, { data: data, expiresAt });
    }

    return data;
}

