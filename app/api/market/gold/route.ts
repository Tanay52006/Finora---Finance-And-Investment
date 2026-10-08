import { prisma } from '@/lib/server/prisma'
import { ok } from '@/lib/server/http'
export async function GET(){return ok(await prisma.asset.findMany({where:{type:'GOLD',isActive:true},orderBy:{name:'asc'}}))}