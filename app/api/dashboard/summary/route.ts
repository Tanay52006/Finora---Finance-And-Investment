import { prisma } from '@/lib/server/prisma'
import { ok } from '@/lib/server/http'
import { withUser } from '@/lib/server/route'
export async function GET(){return withUser(async u=>{
 const [accounts,income,expenses,holdings]=await prisma.$transaction([
  prisma.financialAccount.findMany({where:{userId:u.id}}),
  prisma.transaction.aggregate({where:{userId:u.id,type:'INCOME'},_sum:{amount:true}}),
  prisma.transaction.aggregate({where:{userId:u.id,type:'EXPENSE'},_sum:{amount:true}}),
  prisma.holding.findMany({where:{userId:u.id},include:{asset:true}})
 ])
 const totalBalance=accounts.reduce((a,x)=>a+Number(x.balance),0)
 const totalIncome=Number(income._sum.amount||0), totalExpenses=Number(expenses._sum.amount||0)
 const totalSavings=totalIncome-totalExpenses
 const netWorth=totalBalance+holdings.reduce((a,h)=>a+Number(h.quantity)*Number(h.currentPrice),0)
 const savingsRate=totalIncome?totalSavings/totalIncome*100:0
 return ok({totalBalance,totalIncome,totalExpenses,totalSavings,netWorth,monthlyChange:0,savingsRate})
})}