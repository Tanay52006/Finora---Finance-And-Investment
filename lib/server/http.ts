import { NextResponse } from 'next/server'
export function ok(data:any,status=200){return NextResponse.json({success:true,data},{status})}
export function fail(message:string,code:string,status=400){return NextResponse.json({success:false,message,code},{status})}
export function unauthorized(){return fail('Authentication required','UNAUTHORIZED',401)}
export async function body(req:Request){try{return await req.json()}catch{return {}}}
