import { clearAuthCookies } from '@/lib/server/auth'
import { ok } from '@/lib/server/http'
export async function POST(){await clearAuthCookies();return ok({loggedOut:true})}