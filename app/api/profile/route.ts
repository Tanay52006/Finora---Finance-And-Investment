import { z } from 'zod'
import { prisma } from '@/lib/server/prisma'
import { body,ok } from '@/lib/server/http'
import { withUser } from '@/lib/server/route'
const schema=z.object({name:z.string().min(2).max(80).optional(),avatar:z.string().max(500).nullable().optional(),monthlyIncome:z.coerce.number().min(0).optional(),monthlyExpense:z.coerce.number().min(0).optional(),savingsGoal:z.coerce.number().min(0).optional(),riskPreference:z.string().max(30).optional(),currency:z.string().length(3).optional()})
export async function GET(){return withUser(async u=>ok(await prisma.profile.findUnique({where:{userId:u.id}})))}
export async function PATCH(req:Request){return withUser(async u=>{const p=schema.parse(await body(req));const data:any={...p};if(p.name) await prisma.user.update({where:{id:u.id},data:{name:p.name}});return ok(await prisma.profile.upsert({where:{userId:u.id},update:data,create:{userId:u.id,...data}}))})}