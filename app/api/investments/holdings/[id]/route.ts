import { z } from 'zod'
import { prisma } from '@/lib/server/prisma'
import { body,fail,ok } from '@/lib/server/http'
import { withUser } from '@/lib/server/route'
const s=z.object({quantity:z.coerce.number().positive().optional(),currentPrice:z.coerce.number().positive().optional()})
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){return withUser(async u=>{const {id}=await params;const h=await prisma.holding.findFirst({where:{id,userId:u.id},include:{asset:true}});return h?ok(h):fail('Holding not found','HOLDING_NOT_FOUND',404)})}
export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){return withUser(async u=>{const {id}=await params;const h=await prisma.holding.findFirst({where:{id,userId:u.id}});if(!h)return fail('Holding not found','HOLDING_NOT_FOUND',404);const p=s.safeParse(await body(req));if(!p.success)return fail('Invalid holding','VALIDATION_ERROR',422);return ok(await prisma.holding.update({where:{id},data:p.data}))})}
export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){return withUser(async u=>{const {id}=await params;const h=await prisma.holding.findFirst({where:{id,userId:u.id}});if(!h)return fail('Holding not found','HOLDING_NOT_FOUND',404);await prisma.holding.delete({where:{id}});return ok({deleted:true})})}