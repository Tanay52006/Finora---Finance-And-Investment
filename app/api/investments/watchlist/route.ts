import { z } from 'zod'
import { prisma } from '@/lib/server/prisma'
import { body,fail,ok } from '@/lib/server/http'
import { withUser } from '@/lib/server/route'
export async function GET(){return withUser(async u=>ok(await prisma.watchlist.findMany({where:{userId:u.id},include:{asset:true},orderBy:{createdAt:'desc'}})))}
export async function POST(req:Request){return withUser(async u=>{const p=z.object({assetId:z.string()}).safeParse(await body(req));if(!p.success)return fail('Asset is required','VALIDATION_ERROR',422);if(!await prisma.asset.findUnique({where:{id:p.data.assetId}}))return fail('Asset not found','ASSET_NOT_FOUND',404);const x=await prisma.watchlist.upsert({where:{userId_assetId:{userId:u.id,assetId:p.data.assetId}},update:{},create:{userId:u.id,assetId:p.data.assetId},include:{asset:true}});return ok(x,201)})}