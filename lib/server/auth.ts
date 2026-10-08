import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import { prisma } from './prisma'

const ACCESS_COOKIE = 'finora_access'
const REFRESH_COOKIE = 'finora_refresh'
const secret = () => new TextEncoder().encode(process.env.JWT_SECRET || 'development-access-secret-change-me')
const refreshSecret = () => new TextEncoder().encode(process.env.JWT_REFRESH_SECRET || 'development-refresh-secret-change-me')

export async function createTokens(userId:string){
  const access = await new SignJWT({sub:userId,type:'access'}).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('15m').sign(secret())
  const refresh = await new SignJWT({sub:userId,type:'refresh'}).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('30d').sign(refreshSecret())
  return {access,refresh}
}
export async function setAuthCookies(userId:string){
  const {access,refresh}=await createTokens(userId)
  const jar=await cookies()
  jar.set(ACCESS_COOKIE,access,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*15})
  jar.set(REFRESH_COOKIE,refresh,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60*24*30})
}
export async function clearAuthCookies(){
  const jar=await cookies(); jar.delete(ACCESS_COOKIE); jar.delete(REFRESH_COOKIE)
}
export async function getUserId(){
  const jar=await cookies()
  const token=jar.get(ACCESS_COOKIE)?.value
  if(!token) return null
  try { const {payload}=await jwtVerify(token,secret()); return typeof payload.sub==='string'?payload.sub:null } catch { return null }
}
export async function requireUser(){
  const id=await getUserId()
  if(!id) throw new Error('UNAUTHORIZED')
  const user=await prisma.user.findUnique({where:{id}})
  if(!user) throw new Error('UNAUTHORIZED')
  return user
}
export async function refreshSession(){
  const jar=await cookies(); const token=jar.get(REFRESH_COOKIE)?.value
  if(!token) return null
  try {
    const {payload}=await jwtVerify(token,refreshSecret())
    if(typeof payload.sub!=='string') return null
    const user=await prisma.user.findUnique({where:{id:payload.sub}})
    if(!user) return null
    await setAuthCookies(user.id); return user
  } catch { return null }
}
