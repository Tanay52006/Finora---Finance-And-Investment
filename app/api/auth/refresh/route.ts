import { refreshSession } from '@/lib/server/auth'
import { fail,ok } from '@/lib/server/http'
export async function POST(){const user=await refreshSession();if(!user)return fail('Session expired','SESSION_EXPIRED',401);return ok({id:user.id,name:user.name,email:user.email})}