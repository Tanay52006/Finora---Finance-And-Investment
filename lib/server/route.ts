import { NextResponse } from 'next/server'
import { requireUser } from './auth'
import { fail } from './http'
export async function withUser(fn:(user:any)=>Promise<NextResponse>){
 try { const user=await requireUser(); return await fn(user) }
 catch(e:any){ if(e?.message==='UNAUTHORIZED') return fail('Authentication required','UNAUTHORIZED',401); console.error(e); return fail('Internal server error','INTERNAL_ERROR',500) }
}
