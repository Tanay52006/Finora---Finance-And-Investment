import { z } from 'zod'
import { prisma } from '@/lib/server/prisma'
import { body,fail,ok } from '@/lib/server/http'
import { withUser } from '@/lib/server/route'
const s=z.object({assetId:z.string(),amount:z.coerce.number().positive(),frequency:z.enum(['WEEKLY','MONTHLY','QUARTERLY','YEARLY']).default('MONTHLY'),nextInvestmentDate:z.coerce.date(),status:z.enum(['ACTIVE','PAUSED','COMPLETED']).default('ACTIVE')})
export async function GET(){return withUser(async u=>ok(await prisma.sip.findMany({where:{userId:u.id},include:{asset:true},orderBy:{nextInvestmentDate:'asc'}})))}
export async function POST(req:Request){return withUser(async u=>{const p=s.safeParse(await body(req));if(!p.success)return fail('Invalid SIP','VALIDATION_ERROR',422);if(!await prisma.asset.findUnique({where:{id:p.data.assetId}}))return fail('Asset not found','ASSET_NOT_FOUND',404);return ok(await prisma.sip.create({data:{userId:u.id,...p.data},include:{asset:true}}),201)})}