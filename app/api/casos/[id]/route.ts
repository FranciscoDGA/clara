import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { data: caso, error } = await supabase.from('casos').select('*').eq('id', params.id).eq('usuario_id', user.id).single()
  if (error || !caso) return NextResponse.json({ error: 'Caso não encontrado' }, { status: 404 })

  const { data: documentos } = await supabase.from('documentos').select('*').eq('caso_id', params.id).order('gerado_em', { ascending: false })

  return NextResponse.json({ caso, documentos: documentos ?? [] })
}
