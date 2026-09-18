import { NextResponse } from 'next/server'
import { triar } from '@/lib/ai/triage'

// Webhook WhatsApp Business API (Meta)
// GET = verificação | POST = mensagem recebida
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')
  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge ?? '', { status: 200 })
  }
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const msg = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]
    const texto: string | undefined = msg?.text?.body
    const from: string | undefined = msg?.from
    if (!texto || !from) return NextResponse.json({ ok: true })

    const t = triar(texto)
    // TODO: enviar resposta via Graph API (WHATSAPP_TOKEN/WHATSAPP_PHONE_ID)
    // Por ora, logamos a triagem para auditoria. Ative o envio configurando o token.
    console.log(JSON.stringify({ from, tipo: t.tipo_caso, urgencia: t.urgencia }))

    return NextResponse.json({ ok: true, tipo_caso: t.tipo_caso, urgencia: t.urgencia })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
