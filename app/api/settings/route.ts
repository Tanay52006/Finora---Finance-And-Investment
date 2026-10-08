import { z } from 'zod'
import { prisma } from '@/lib/server/prisma'
import { body,ok } from '@/lib/server/http'
import { withUser } from '@/lib/server/route'
const schema=z.object({currency:z.string().length(3).optional(),theme:z.string().max(20).optional(),budgetAlerts:z.boolean().optional(),investmentUpdates:z.boolean().optional(),goalReminders:z.boolean().optional(),weeklySummary:z.boolean().optional()})
export async function GET(){return withUser(async u=>ok(await prisma.userSettings.findUnique({where:{userId:u.id}})))}
export async function PATCH(req:Request){return withUser(async u=>{const p=schema.parse(await body(req));return ok(await prisma.userSettings.upsert({where:{userId:u.id},update:p,create:{userId:u.id,...p}}))})}
