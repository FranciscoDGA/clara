import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/inputs'
import { TIPO_CASO_LABELS, STATUS_CASO_LABELS, URGENCIA_LABELS } from '@/lib/constants'
import { formatRelativeTime } from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: casos } = await supabase
    .from('casos')
    .select('id, tipo_caso, status, urgencia, criado_em')
    .eq('usuario_id', user.id)
    .order('criado_em', { ascending: false })
    .limit(20)

  const { data: perfil } = await supabase.from('perfis').select('nome, plano').eq('id', user.id).single()

  return (
    <div className="min-h-screen bg-clara-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-clara-700">Clara</Link>
          <div className="flex items-center gap-2">
            <Badge className="bg-clara-50 text-clara-700 border-clara-200">{perfil?.plano ?? 'gratuito'}</Badge>
            <span className="text-sm text-muted-foreground hidden sm:inline">{perfil?.nome ?? user.email}</span>
            <Link href="/triagem"><Button size="sm">+ Novo caso</Button></Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Olá, {perfil?.nome?.split(' ')[0] ?? 'bem-vinda'} 👋</h1>
          <p className="text-muted-foreground">Acompanhe seus casos e documentos.</p>
        </div>
        {!casos || casos.length === 0 ? (
          <Card>
            <CardHeader><CardTitle>Nenhum caso ainda</CardTitle><CardDescription>Faça a triagem gratuita e gere seus primeiros documentos.</CardDescription></CardHeader>
            <CardContent><Link href="/triagem"><Button>Fazer triagem</Button></Link></CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {(casos ?? []).map((c) => {
              const urg = URGENCIA_LABELS[c.urgencia]
              return (
                <Link key={c.id} href={`/casos/${c.id}`}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{TIPO_CASO_LABELS[c.tipo_caso] ?? c.tipo_caso}</p>
                        <p className="text-xs text-muted-foreground">{STATUS_CASO_LABELS[c.status]} • {formatRelativeTime(c.criado_em)}</p>
                      </div>
                      {urg && <Badge className={urg.color}>{urg.icon} {urg.label}</Badge>}
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
