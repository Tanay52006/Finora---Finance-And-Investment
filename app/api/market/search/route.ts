import { prisma } from '@/lib/server/prisma'
import { ok } from '@/lib/server/http'
export async function GET(req:Request){const q=new URL(req.url).searchParams.get('q')||'';return ok(await prisma.asset.findMany({where:{isActive:true,OR:[{symbol:{contains:q,mode:'insensitive'}},{name:{contains:q,mode:'insensitive'}}]},take:25}))}