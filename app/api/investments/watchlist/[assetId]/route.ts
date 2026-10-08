import { prisma } from '@/lib/server/prisma'
import { fail,ok } from '@/lib/server/http'
import { withUser } from '@/lib/server/route'
export async function DELETE(_:Request,{params}:{params:Promise<{assetId:string}>}){return withUser(async u=>{const {assetId}=await params;await prisma.watchlist.deleteMany({where:{userId:u.id,assetId}});return ok({deleted:true})})}