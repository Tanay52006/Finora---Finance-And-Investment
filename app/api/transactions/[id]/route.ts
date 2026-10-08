import { z } from 'zod'
import { prisma } from '@/lib/server/prisma'
import { body,fail,ok } from '@/lib/server/http'
import { withUser } from '@/lib/server/route'
const schema=z.object({type:z.enum(['INCOME','EXPENSE']).optional(),description:z.string().min(1).max(200).optional(),amount:z.coerce.number().positive().optional(),category:z.string().min(1).max(80).optional(),date:z.coerce.date().optional(),accountId:z.string().nullable().optional(),notes:z.string().max(500).nullable().optional()})
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){return withUser(async u=>{const {id}=await params;const x=await prisma.transaction.findFirst({where:{id,userId:u.id}});return x?ok(x):fail('Transaction not found','TRANSACTION_NOT_FOUND',404)})}
export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){return withUser(async u=>{const {id}=await params;const p=schema.safeParse(await body(req));if(!p.success)return fail('Invalid transaction','VALIDATION_ERROR',422);const existing=await prisma.transaction.findFirst({where:{id,userId:u.id}});if(!existing)return fail('Transaction not found','TRANSACTION_NOT_FOUND',404);return ok(await prisma.transaction.update({where:{id},data:p.data}))})}
export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){return withUser(async u=>{const {id}=await params;const existing=await prisma.transaction.findFirst({where:{id,userId:u.id}});if(!existing)return fail('Transaction not found','TRANSACTION_NOT_FOUND',404);await prisma.$transaction(async db=>{
 await db.transaction.delete({where:{id}})
 if(existing.accountId){const delta=existing.type==='INCOME'?Number(existing.amount):-Number(existing.amount);await db.financialAccount.update({where:{id:existing.accountId},data:{balance:{decrement:delta}}})}
});return ok({deleted:true})})}