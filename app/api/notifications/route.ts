import { prisma } from '@/lib/server/prisma'
import { ok } from '@/lib/server/http'
import { withUser } from '@/lib/server/route'
export async function GET(){return withUser(async u=>ok(await prisma.notification.findMany({where:{userId:u.id},orderBy:{createdAt:'desc'}})))}
