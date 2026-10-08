import { prisma } from '@/lib/server/prisma'
import { fail,ok } from '@/lib/server/http'
import { withUser } from '@/lib/server/route'
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){return withUser(async u=>{const {id}=await params;const x=await prisma.investmentTransaction.findFirst({where:{id,userId:u.id},include:{asset:true}});return x?ok(x):fail('Investment transaction not found','INVESTMENT_TRANSACTION_NOT_FOUND',404)})}