import { z } from 'zod'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/server/prisma'
import { setAuthCookies } from '@/lib/server/auth'
import { body, fail, ok } from '@/lib/server/http'
import { rateLimit } from '@/lib/server/rate-limit'
const schema=z.object({email:z.string().email(),password:z.string().min(1)})
export async function POST(req:Request){
 if(!rateLimit('login',15,60_000)) return fail('Too many login attempts','RATE_LIMITED',429)
 const p=schema.safeParse(await body(req)); if(!p.success) return fail('Invalid credentials','INVALID_CREDENTIALS',401)
 const user=await prisma.user.findUnique({where:{email:p.data.email.toLowerCase()}})
 if(!user||!(await bcrypt.compare(p.data.password,user.passwordHash))) return fail('Invalid email or password','INVALID_CREDENTIALS',401)
 await setAuthCookies(user.id); return ok({id:user.id,name:user.name,email:user.email})
}