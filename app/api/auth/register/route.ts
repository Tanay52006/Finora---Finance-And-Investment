import { z } from 'zod'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/server/prisma'
import { setAuthCookies } from '@/lib/server/auth'
import { body, fail, ok } from '@/lib/server/http'
import { rateLimit } from '@/lib/server/rate-limit'
const schema=z.object({name:z.string().min(2).max(80),email:z.string().email(),password:z.string().min(8).max(128)})
export async function POST(req:Request){
 if(!rateLimit('register',10,60_000)) return fail('Too many attempts','RATE_LIMITED',429)
 const parsed=schema.safeParse(await body(req)); if(!parsed.success) return fail('Invalid registration details','VALIDATION_ERROR',422)
 const {name,email,password}=parsed.data
 if(await prisma.user.findUnique({where:{email:email.toLowerCase()}})) return fail('Email is already registered','EMAIL_EXISTS',409)
 const passwordHash=await bcrypt.hash(password,12)
 const user=await prisma.user.create({data:{name,email:email.toLowerCase(),passwordHash,profile:{create:{}},settings:{create:{}}},select:{id:true,name:true,email:true}})
 await setAuthCookies(user.id); return ok(user,201)
}