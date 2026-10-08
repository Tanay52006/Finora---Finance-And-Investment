import { withUser } from '@/lib/server/route'
import { ok } from '@/lib/server/http'
export async function GET(){return withUser(async user=>ok({id:user.id,name:user.name,email:user.email}))}