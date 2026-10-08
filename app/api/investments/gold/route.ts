import { prisma } from '@/lib/server/prisma'
import { ok } from '@/lib/server/http'
import { withUser } from '@/lib/server/route'
export async function GET(){return withUser(async u=>ok(await prisma.holding.findMany({where:{userId:u.id,asset:{type:'GOLD'}},include:{asset:true}})))}