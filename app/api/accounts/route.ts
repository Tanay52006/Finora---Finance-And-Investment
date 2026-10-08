import { z } from 'zod'
import { prisma } from '@/lib/server/prisma'
import { body,fail,ok } from '@/lib/server/http'
import { withUser } from '@/lib/server/route'
const s=z.object({name:z.string().min(1).max(80),type:z.string().max(30).optional(),balance:z.coerce.number().min(0).optional(),currency:z.string().length(3).optional()})
export async function GET(){return withUser(async u=>ok(await prisma.financialAccount.findMany({where:{userId:u.id},orderBy:{createdAt:'asc'}})))}
export async function POST(req:Request){return withUser(async u=>{const p=s.safeParse(await body(req));if(!p.success)return fail('Invalid account','VALIDATION_ERROR',422);return ok(await prisma.financialAccount.create({data:{userId:u.id,...p.data}}),201)})}