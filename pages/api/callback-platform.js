// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { supabase } from '../../util/supabaseClient'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    if (req.body && req.body.action) {
      await handlePlatformMessage(req.body, req.body.action);
      res.status(202).json({ message: 'success'} );
    } else {
      res.status(400).json({ error: "action was not provided" });
    }
  } else {
    res.status(405).json({ error: "Method not supported" });
  }
}

async function handlePlatformMessage(payload, action) {
  switch (action){
    case 'APP_INSTALLED':
      await insertAccount(payload.account_id);
      break;
    case 'APP_UNINSTALLED':
      await removeAccount(payload.account_id);
      break;
    default:
      console.error(`Skipped unknown action "${action}"`)    
  }
}

async function insertAccount(accountId) {
  const { error, data } = await supabase.from('account').upsert({ external_id: accountId });
  if (error) {
    console.error(error);
    throw Error("An error has occured");
  }

  return data;
}

async function removeAccount(accountId) {
  const { error, data } = await supabase.from('account').delete().match({ external_id: accountId });
  if (error) {
    console.error(error);
    throw Error("An error has occured");
  }
  return data;
}
