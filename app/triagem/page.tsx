'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea, Label, Badge } from '@/components/ui/inputs'
import { TIPO_CASO_LABELS, URGENCIA_LABELS } from '@/lib/constants'
import type { TriagemResult } from '@/lib/types'

export default function TriagemPage() {
  const router = useRouter()
  const [relato, setRelato] = useState('')
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState<TriagemResult | null>(null)
  const [erro, setErro] = useState('')

  async function analisar() {
    if (relato.trim().length < 20) { setErro('Conte um pouco mais (mín. 20 caracteres).'); return }
    setErro(''); setLoading(true); setResultado(null)
    try {
      const res = await fetch('/api/triagem', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ relato }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Falha na triagem')
      setResultado(data)
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro inesperado')
    } finally { setLoading(false) }
  }

  async function salvarCaso() {
    if (!resultado) return
    setLoading(true)
    try {
      const res = await fetch('/api/casos', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ relato, triagem: resultado }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Faça login para salvar o caso')
      router.push(`/casos/${data.id}`)
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro ao salvar')
      setLoading(false)
    }
  }

  const urg = resultado ? URGENCIA_LABELS[resultado.urgencia] : null

  return (
    <div className="min-h-screen bg-clara-50 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Triagem gratuita</CardTitle>
            <CardDescription>Descreva com suas palavras. Ex: “Me separei há 3 meses, ele não paga pensão dos 2 filhos, tenho medo de ficar sem nada”.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="relato">Sua história</Label>
              <Textarea id="relato" value={relato} onChange={(e) => setRelato(e.target.value)} placeholder="O que aconteceu? Quando? Quem está envolvido? Há filhos? Há risco?" rows={6} />
            </div>
            {erro && <p className="text-sm text-red-600">{erro}</p>}
            <div className="flex gap-2">
              <Button onClick={analisar} disabled={loading}>{loading ? 'Analisando...' : 'Analisar meu caso'}</Button>
              <Button variant="outline" onClick={() => { setRelato(''); setResultado(null) }}>Limpar</Button>
            </div>
          </CardContent>
        </Card>

        {resultado && (
          <Card className="animate-in">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle>{TIPO_CASO_LABELS[resultado.tipo_caso] ?? resultado.tipo_caso}</CardTitle>
                {urg && <Badge className={urg.color}>{urg.icon} {urg.label}</Badge>}
                <Badge>Confiança {Math.round(resultado.confianca * 100)}%</Badge>
              </div>
              <CardDescription>Categoria: {resultado.categoria}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <h3 className="font-semibold mb-2">Passo a passo</h3>
                <ol className="list-decimal ml-5 space-y-1.5 text-sm">
                  {resultado.proximos_passos.map((p) => <li key={p}>{p}</li>)}
                </ol>
              </div>
              {resultado.documentos_sugeridos.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Documentos que a Clara gera</h3>
                  <div className="flex flex-wrap gap-2">
                    {resultado.documentos_sugeridos.map((d) => <Badge key={d} className="bg-clara-50 text-clara-700 border-clara-200">📄 {d}</Badge>)}
                  </div>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={salvarCaso} disabled={loading}>Salvar caso e gerar documentos</Button>
                <Link href="/checklist"><Button variant="outline">Ver checklist e endereços</Button></Link>
                <p className="text-xs text-muted-foreground self-center">Precisa de login — leva 30 segundos.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
