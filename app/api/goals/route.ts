import { z } from 'zod'
import { prisma } from '@/lib/server/prisma'
import { body,fail,ok } from '@/lib/server/http'
import { withUser } from '@/lib/server/route'
const s=z.object({name:z.string().min(1).max(120),targetAmount:z.coerce.number().positive(),currentAmount:z.coerce.number().min(0).default(0),targetDate:z.coerce.date(),monthlyContribution:z.coerce.number().min(0).default(0),category:z.string().max(80).optional()})
const enrich=(g:any)=>{const target=Number(g.targetAmount),current=Number(g.currentAmount),remain=Math.max(0,target-current),months=g.monthlyContribution>0?Math.ceil(remain/Number(g.monthlyContribution)):null;let estimated=null;if(months){estimated=new Date();estimated.setMonth(estimated.getMonth()+months)}return {...g,percentageComplete:target?Math.min(100,current/target*100):0,remainingAmount:remain,estimatedCompletion:estimated}}
export async function GET(){return withUser(async u=>ok((await prisma.goal.findMany({where:{userId:u.id},orderBy:{targetDate:'asc'}})).map(enrich)))}
export async function POST(req:Request){return withUser(async u=>{const p=s.safeParse(await body(req));if(!p.success)return fail('Invalid goal','VALIDATION_ERROR',422);return ok(enrich(await prisma.goal.create({data:{userId:u.id,...p.data}})),201)})}