import { prisma } from '@/lib/server/prisma'
import { ok } from '@/lib/server/http'
import { withUser } from '@/lib/server/route'
export async function PATCH(){return withUser(async u=>{await prisma.notification.updateMany({where:{userId:u.id,read:false},data:{read:true}});return ok({updated:true})})}