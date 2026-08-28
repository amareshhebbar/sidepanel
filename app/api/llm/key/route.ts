import { getSession } from "@/lib/session";
import { LlmProvider } from "@/types";
import { NextRequest, NextResponse } from "next/server";

const validProviders: LlmProvider[] = ['anthropic', 'gemini', 'groq', 'deepseek']


export async function POST(request :NextRequest){
    const body = await request.json()
    const {provider, key} = body as {provider?:string, key?:string}
    if(!provider || !validProviders.includes(provider as LlmProvider)){
        return NextResponse.json({error: "invalid provider"}, {status: 400})
    } 
    if(!key || typeof key!=="string" || key.trim().length == 0){
        return NextResponse.json({error: "invalid key"}, {status: 400})
    }
    const session=await getSession()
    session.llmProvider=provider as LlmProvider
    session.llmKey = key.trim()
    return NextResponse.json({provider :session.llmProvider, hasKey: true})
}

export async function GET(){
    const session= await getSession()
    return NextResponse.json({
    provider: session.llmProvider ?? null,
    hasKey: Boolean(session.llmKey)
  })

}

export async function DELETE() {
  const session = await getSession()
  session.destroy()

  return NextResponse.json({ cleared: true })
}