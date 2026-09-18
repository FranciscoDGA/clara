import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { gerarDocumento } from '@/lib/documents/templates'

const LIMITE_MENSAL: Record<string, number> = { gratuito: 2, clara_plus: 9999, clara_pro: 9999 }

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { data: caso, error: errCaso } = await supabase.from('casos').select('*').eq('id', params.id).eq('usuario_id', user.id).single()
  if (errCaso || !caso) return NextResponse.json({ error: 'Caso não encontrado' }, { status: 404 })

  const { data: perfil } = await supabase.from('perfis').select('plano').eq('id', user.id).single()
  const plano = perfil?.plano ?? 'gratuito'

  const inicioMes = new Date()
  inicioMes.setDate(1); inicioMes.setHours(0, 0, 0, 0)
  const { count } = await supabase.from('documentos').select('id', { count: 'exact', head: true })
    .eq('caso_id', params.id).gte('gerado_em', inicioMes.toISOString())
  if ((count ?? 0) >= (LIMITE_MENSAL[plano] ?? 2)) {
    return NextResponse.json({ error: 'Limite mensal de documentos atingido. Assine Clara+ para ilimitado.' }, { status: 402 })
  }

  const body = await req.json()
  const tipo = String(body?.tipo_documento ?? '')
  const complementares = (body?.dados_complementares ?? {}) as Record<string, unknown>

  try {
    const dados = { ...(caso.dados_extraidos as Record<string, unknown>), ...complementares }
    const { titulo, markdown, faltantes } = gerarDocumento(tipo, dados)

    const { data: doc, error: errDoc } = await supabase.from('documentos').insert({
      caso_id: params.id, tipo, titulo, conteudo_markdown: markdown, variaveis_faltantes: faltantes,
    }).select('id').single()
    if (errDoc) throw new Error(errDoc.message)

    await supabase.from('casos').update({ status: 'documentos_gerados' }).eq('id', params.id)

    return NextResponse.json({
      documento_id: doc.id, titulo,
      preview_markdown: markdown,
      variaveis_faltantes: faltantes,
    }, { status: 201 })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Falha ao gerar documento' }, { status: 400 })
  }
}
