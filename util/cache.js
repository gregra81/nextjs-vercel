import { supabase } from './supabaseClient';

export const cacheGet = async (cacheKey) => {
    const res = await supabase.from('cache').select().match({ key: cacheKey });
    if (res.data.length > 0){
        return res.data.pop().value;
    }
    return false;
}

export const cacheSet = async (cacheKey, cacheValue) => {
    return await supabase.from('cache').upsert({ key: cacheKey, value: cacheValue });
}