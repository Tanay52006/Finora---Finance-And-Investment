import { prisma } from '@/lib/server/prisma'
import { fail,ok } from '@/lib/server/http'
import { withUser } from '@/lib/server/route'
export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){return withUser(async u=>{const {id}=await params;const x=await prisma.notification.findFirst({where:{id,userId:u.id}});if(!x)return fail('Notification not found','NOTIFICATION_NOT_FOUND',404);await prisma.notification.delete({where:{id}});return ok({deleted:true})})}