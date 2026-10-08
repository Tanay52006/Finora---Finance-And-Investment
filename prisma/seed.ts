import { PrismaClient, AssetType, TransactionType, InvestmentTransactionType, NotificationType, SipFrequency, SipStatus } from '@prisma/client'
import bcrypt from 'bcrypt'
const prisma=new PrismaClient()
const dec=(n:number)=>n

const assets=[
 ['TCS','Tata Consultancy Services',AssetType.STOCK,3842.5,1.24,'₹14.1L Cr',29.4],
 ['RELIANCE','Reliance Industries',AssetType.STOCK,2940.2,0.84,'₹19.9L Cr',25.8],
 ['HDFCBANK','HDFC Bank',AssetType.STOCK,1762.3,-0.42,'₹13.4L Cr',18.2],
 ['INFY','Infosys',AssetType.STOCK,1985.1,1.14,'₹8.2L Cr',28.1],
 ['ICICIBANK','ICICI Bank',AssetType.STOCK,1248.6,0.66,'₹8.7L Cr',19.6],
 ['ITC','ITC Limited',AssetType.STOCK,468.4,-0.18,'₹5.8L Cr',27.3],
 ['LT','Larsen & Toubro',AssetType.STOCK,3612.8,2.10,'₹4.9L Cr',32.4],
 ['BHARTIARTL','Bharti Airtel',AssetType.STOCK,1682.75,0.92,'₹10.1L Cr',68.2],
 ['ASIANPAINT','Asian Paints',AssetType.STOCK,2932.1,-0.55,'₹2.8L Cr',51.3],
 ['SUNPHARMA','Sun Pharma',AssetType.STOCK,1768.4,1.80,'₹4.2L Cr',38.9],
 ['PPFAS','Parag Parikh Flexi Cap Fund',AssetType.MUTUAL_FUND,78.42,18.4,'₹82,000 Cr',22.4],
 ['HDFCMID','HDFC Mid Cap Fund',AssetType.MUTUAL_FUND,162.2,22.1,'₹74,000 Cr',19.2],
 ['NIFTY50ETF','NIFTY 50 ETF',AssetType.ETF,245.6,16.8,'₹31,000 Cr',18.1],
 ['GOLDETF','Gold ETF',AssetType.ETF,62.8,12.8,'₹18,000 Cr',0],
 ['GOLD','Gold',AssetType.GOLD,7950,0.7,'',0],
 ['FD','Fixed Income',AssetType.FIXED_INCOME,100,0.4,'',0],
] as const

async function main(){
 const passwordHash=await bcrypt.hash('FinoraDemo@2026',12)
 const user=await prisma.user.upsert({where:{email:'demo@finora.app'},update:{name:'Finora Demo User'},create:{name:'Finora Demo User',email:'demo@finora.app',passwordHash}})
 await prisma.profile.upsert({where:{userId:user.id},update:{},create:{userId:user.id,monthlyIncome:125000,monthlyExpense:65000,savingsGoal:500000,riskPreference:'MODERATE',currency:'INR'}})
 await prisma.userSettings.upsert({where:{userId:user.id},update:{},create:{userId:user.id}})
 let cash=await prisma.financialAccount.findFirst({where:{userId:user.id,name:'Main Wallet'}})
 if(!cash) cash=await prisma.financialAccount.create({data:{userId:user.id,name:'Main Wallet',type:'CASH',balance:2052032,currency:'INR'}})

 for(const [symbol,name,type,price,chg,cap,pe] of assets){
   await prisma.asset.upsert({where:{symbol},update:{price,dayChangePercentage:chg,marketCap:cap,peRatio:pe},create:{
     symbol,name,type,price,dayChangePercentage:chg,dayChange:chg/100*price,marketCap:cap,peRatio:pe,
     exchange:type===AssetType.STOCK?'NSE':undefined,description:`Demo ${name} data for FINORA`,high52Week:price*1.12,low52Week:price*.78,
     nav:type===AssetType.MUTUAL_FUND?price:undefined,return1Y:chg+12,return3Y:chg+28,return5Y:chg+46,risk:type===AssetType.MUTUAL_FUND?'Moderate':undefined,
     expenseRatio:type===AssetType.MUTUAL_FUND ? 0.85 : undefined,aum:type===AssetType.MUTUAL_FUND?cap:undefined,fundManager:type===AssetType.MUTUAL_FUND?'FINORA Demo AMC':undefined,
     trackingIndex:type===AssetType.ETF?'NIFTY 50':undefined
   }})
 }
 const txCount=await prisma.transaction.count({where:{userId:user.id}})
 if(txCount===0){
  await prisma.transaction.createMany({data:[
   {userId:user.id,accountId:cash.id,type:TransactionType.INCOME,description:'Salary payment',amount:125000,category:'Salary',date:new Date()},
   {userId:user.id,accountId:cash.id,type:TransactionType.EXPENSE,description:'Software License',amount:25500,category:'Business',date:new Date('2026-10-07')},
   {userId:user.id,accountId:cash.id,type:TransactionType.EXPENSE,description:'Flight Ticket',amount:22750,category:'Travel',date:new Date('2026-10-06')},
   {userId:user.id,accountId:cash.id,type:TransactionType.EXPENSE,description:'Office Supplies',amount:8420,category:'Business',date:new Date('2026-10-04')},
  ]})
 }
 const budgets=await prisma.budget.count({where:{userId:user.id}})
 if(!budgets) await prisma.budget.createMany({data:[
  {userId:user.id,category:'Food',limit:15000,month:10,year:2026},
  {userId:user.id,category:'Travel',limit:30000,month:10,year:2026},
  {userId:user.id,category:'Business',limit:40000,month:10,year:2026},
 ]})
 const goals=await prisma.goal.count({where:{userId:user.id}})
 if(!goals) await prisma.goal.createMany({data:[
  {userId:user.id,name:'Emergency Fund',targetAmount:500000,currentAmount:340000,targetDate:new Date('2027-06-01'),monthlyContribution:30000,category:'Savings'},
  {userId:user.id,name:'Buy a House',targetAmount:2500000,currentAmount:750000,targetDate:new Date('2030-01-01'),monthlyContribution:50000,category:'Property'},
 ]})
 const tcs=await prisma.asset.findUniqueOrThrow({where:{symbol:'TCS'}})
 const rel=await prisma.asset.findUniqueOrThrow({where:{symbol:'RELIANCE'}})
 const ppf=await prisma.asset.findUniqueOrThrow({where:{symbol:'PPFAS'}})
 if(await prisma.holding.count({where:{userId:user.id}})===0){
  await prisma.holding.createMany({data:[
   {userId:user.id,assetId:tcs.id,quantity:12,averageBuyPrice:3833,currentPrice:3842.5},
   {userId:user.id,assetId:rel.id,quantity:18,averageBuyPrice:2888,currentPrice:2940.2},
   {userId:user.id,assetId:ppf.id,quantity:1200,averageBuyPrice:72.4,currentPrice:78.42},
  ]})
 }
 if(await prisma.watchlist.count({where:{userId:user.id}})===0){
  await prisma.watchlist.createMany({data:[
   {userId:user.id,assetId:tcs.id},{userId:user.id,assetId:rel.id},{userId:user.id,assetId:ppf.id}
  ]})
 }
 if(await prisma.sip.count({where:{userId:user.id}})===0){
  await prisma.sip.create({data:{userId:user.id,assetId:ppf.id,amount:5000,frequency:SipFrequency.MONTHLY,nextInvestmentDate:new Date('2026-10-10'),status:SipStatus.ACTIVE}})
 }
 if(await prisma.notification.count({where:{userId:user.id}})===0){
  await prisma.notification.createMany({data:[
   {userId:user.id,type:NotificationType.INVESTMENT_UPDATE,title:'Portfolio update',message:'Your demo portfolio crossed ₹5,00,000.'},
   {userId:user.id,type:NotificationType.SYSTEM,title:'Welcome to FINORA',message:'This account contains clearly labelled demo financial data.'}
  ]})
 }
 if(await prisma.portfolioSnapshot.count({where:{userId:user.id}})===0){
  const now=new Date()
  const rows=Array.from({length:12},(_,i)=>{const d=new Date(now);d.setMonth(now.getMonth()-11+i);d.setDate(1);return {userId:user.id,date:d,value:380000+i*16000,invested:350000+i*12000}})
  await prisma.portfolioSnapshot.createMany({data:rows})
 }
 console.log('FINORA seed complete.')
 console.log('Demo login: demo@finora.app / FinoraDemo@2026')
}
main().catch(e=>{console.error(e);process.exit(1)}).finally(()=>prisma.$disconnect())
