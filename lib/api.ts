export type ApiResult<T>={success:boolean,data?:T,message?:string,code?:string}
async function request<T=any>(path:string,init:RequestInit={}):Promise<{res:Response,json:ApiResult<T>}>{
 const res=await fetch(path,{...init,credentials:'include',headers:{'Content-Type':'application/json',...(init.headers||{})}})
 const json:ApiResult<T>=await res.json().catch(()=>({success:false,message:'Invalid server response'}))
 return {res,json}
}
export async function api<T=any>(path:string,init:RequestInit={}){
 let {res,json}=await request<T>(path,init)
 if(res.status===401&&!path.startsWith('/api/auth/')){
   const refresh=await request('/api/auth/refresh',{method:'POST'})
   if(refresh.res.ok&&refresh.json.success) ({res,json}=await request<T>(path,init))
 }
 if(!res.ok||!json.success){const e=new Error(json.message||'Request failed');(e as any).status=res.status;(e as any).code=json.code;throw e}
 return json.data as T
}
export const apiGet=<T=any>(p:string)=>api<T>(p)
export const apiPost=<T=any>(p:string,data:any)=>api<T>(p,{method:'POST',body:JSON.stringify(data)})
export const apiPatch=<T=any>(p:string,data:any)=>api<T>(p,{method:'PATCH',body:JSON.stringify(data)})
export const apiDelete=<T=any>(p:string)=>api<T>(p,{method:'DELETE'})
