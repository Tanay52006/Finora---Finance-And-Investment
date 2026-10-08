import { z } from 'zod'
import { prisma } from '@/lib/server/prisma'
import { body,fail,ok } from '@/lib/server/http'
import { withUser } from '@/lib/server/route'
const s=z.object({amount:z.coerce.number().positive().optional(),frequency:z.enum(['WEEKLY','MONTHLY','QUARTERLY','YEARLY']).optional(),nextInvestmentDate:z.coerce.date().optional(),status:z.enum(['ACTIVE','PAUSED','COMPLETED']).optional()})
export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){return withUser(async u=>{const {id}=await params;const x=await prisma.sip.findFirst({where:{id,userId:u.id}});if(!x)return fail('SIP not found','SIP_NOT_FOUND',404);const p=s.safeParse(await body(req));if(!p.success)return fail('Invalid SIP','VALIDATION_ERROR',422);return ok(await prisma.sip.update({where:{id},data:p.data,include:{asset:true}}))})}
export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){return withUser(async u=>{const {id}=await params;const x=await prisma.sip.findFirst({where:{id,userId:u.id}});if(!x)return fail('SIP not found','SIP_NOT_FOUND',404);await prisma.sip.delete({where:{id}});return ok({deleted:true})})}