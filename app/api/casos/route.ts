import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { triar } from '@/lib/ai/triage'

export async function POST(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Faça login para salvar o caso.' }, { status: 401 })

  const body = await req.json()
  const relato = String(body?.relato ?? '')
  const triagem = body?.triagem ?? triar(relato)

  // Limite plano gratuito: 1 caso ativo
  const { data: perfil } = await supabase.from('perfis').select('plano').eq('id', user.id).single()
  if (perfil?.plano === 'gratuito') {
    const { count } = await supabase.from('casos').select('id', { count: 'exact', head: true })
      .eq('usuario_id', user.id).not('status', 'in', '(concluido,arquivado)')
    if ((count ?? 0) >= 1) {
      return NextResponse.json({ error: 'Plano gratuito permite 1 caso ativo. Conclua ou arquive o atual, ou assine Clara+.' }, { status: 402 })
    }
  }

  const { data, error } = await supabase.from('casos').insert({
    usuario_id: user.id,
    tipo_caso: triagem.tipo_caso,
    categoria: triagem.categoria,
    urgencia: triagem.urgencia,
    relato_original: relato,
    dados_extraidos: { ...(triagem.dados_extraidos ?? {}), documentos_sugeridos: triagem.documentos_sugeridos ?? [], proximos_passos: triagem.proximos_passos ?? [] },
  }).select('id').single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.from('logs_ia').insert({ caso_id: data.id, etapa: 'triagem', tokens_estimados: triagem.tokens_estimados ?? 0 })

  return NextResponse.json({ id: data.id }, { status: 201 })
}

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  const { data, error } = await supabase.from('casos').select('*').eq('usuario_id', user.id).order('criado_em', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ casos: data })
}
