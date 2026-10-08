import { prisma } from '@/lib/server/prisma'
import { fail,ok } from '@/lib/server/http'
export async function GET(_:Request,{params}:{params:Promise<{symbol:string}>}){const {symbol}=await params;const a=await prisma.asset.findFirst({where:{symbol,type:'STOCK'}});return a?ok(a):fail('Stock not found','ASSET_NOT_FOUND',404)}