'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge, Input, Label, Textarea } from '@/components/ui/inputs'
import { TIPO_CASO_LABELS } from '@/lib/constants'
import type { Caso, Documento } from '@/lib/types'
import { jsPDF } from 'jspdf'

// Gera PDF com texto selecionável (sem html2canvas): cabeçalho Clara,
// corpo com quebra de linha/página e rodapé com aviso legal.
function baixarPDF(doc: Documento) {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = 210
  const margem = 15
  const larguraTexto = W - margem * 2
  let y = 20

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(14)
  pdf.text('Clara — Seus Direitos, Claros', margem, y)
  y += 7
  pdf.setFontSize(11)
  pdf.text(doc.titulo, margem, y)
  y += 4
  pdf.setDrawColor(180)
  pdf.line(margem, y, W - margem, y)
  y += 6

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  const linhas = pdf.splitTextToSize(doc.conteudo_markdown, larguraTexto) as string[]
  const rodape = (p: number) => {
    pdf.setFontSize(8)
    pdf.setTextColor(130)
    pdf.text(`Documento-base gerado pela Clara. Leve à Defensoria/advogada. Pág. ${p}`, margem, 287)
    pdf.setTextColor(0)
    pdf.setFontSize(10)
  }
  let pagina = 1
  for (const linha of linhas) {
    if (y > 275) { rodape(pagina); pdf.addPage(); pagina += 1; y = 20 }
    pdf.text(linha, margem, y)
    y += 5
  }
  rodape(pagina)
  pdf.save(`clara_${doc.tipo}.pdf`)
}

export default function CasoPage({ params }: { params: { id: string } }) {
  const [caso, setCaso] = useState<Caso | null>(null)
  const [docs, setDocs] = useState<Documento[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [gerando, setGerando] = useState(false)
  const [form, setForm] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch(`/api/casos/${params.id}`)
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (!ok) throw new Error(d.error ?? 'Caso não encontrado')
        setCaso(d.caso); setDocs(d.documentos ?? [])
      })
      .catch((e) => setErro(e.message))
      .finally(() => setLoading(false))
  }, [params.id])

  async function gerar(tipo: string) {
    setGerando(true); setErro('')
    try {
      const res = await fetch(`/api/casos/${params.id}/documentos`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo_documento: tipo, dados_complementares: form }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Falha ao gerar')
      setDocs((prev) => [{ id: data.documento_id, caso_id: params.id, tipo, titulo: data.titulo, conteudo_markdown: data.preview_markdown, variaveis_faltantes: data.variaveis_faltantes ?? [], status: 'gerado', gerado_em: new Date().toISOString() }, ...prev])
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro')
    } finally { setGerando(false) }
  }

  function baixar(doc: Documento) {
    const blob = new Blob([doc.conteudo_markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${doc.tipo}.md`; a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <div className="min-h-screen grid place-items-center">Carregando...</div>
  if (erro && !caso) return <div className="min-h-screen grid place-items-center px-4"><Card className="max-w-md"><CardContent className="p-6"><p className="text-red-600">{erro}</p><Link href="/dashboard"><Button className="mt-4" variant="outline">Voltar</Button></Link></CardContent></Card></div>

  const sugeridos: string[] = Array.isArray((caso?.dados_extraidos as Record<string, unknown>)?.documentos_sugeridos)
    ? ((caso!.dados_extraidos as Record<string, unknown>).documentos_sugeridos as string[])
    : ['peticao_alimentos', 'gratuidade']

  return (
    <div className="min-h-screen bg-clara-50 px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link href="/dashboard"><Button variant="ghost" size="sm">← Voltar</Button></Link>
        <Link href="/checklist"><Button variant="outline" size="sm">Checklist e endereços da Defensoria</Button></Link>
        <Card>
          <CardHeader>
            <CardTitle>{caso && (TIPO_CASO_LABELS[caso.tipo_caso] ?? caso.tipo_caso)}</CardTitle>
            <CardDescription>Status: {caso?.status} • Urgência: {caso?.urgencia}</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader><CardTitle>Complete seus dados (opcional)</CardTitle><CardDescription>Quanto mais completo, melhor o documento. Nada é obrigatório.</CardDescription></CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            {[
              ['nome_completo', 'Nome completo'],
              ['cpf', 'CPF'],
              ['endereco_completo', 'Endereço completo'],
              ['comarca', 'Comarca (cidade/UF)'],
              ['nome_reu', 'Nome do réu (ex: pai das crianças)'],
              ['renda_reu', 'Renda mensal do réu (ex: 2500)'],
            ].map(([k, label]) => (
              <div key={k} className="space-y-1.5">
                <Label htmlFor={k}>{label}</Label>
                <Input id={k} value={form[k] ?? ''} onChange={(e) => setForm({ ...form, [k]: e.target.value })} placeholder={label} />
              </div>
            ))}
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="descricao_fatos">Descrição dos fatos</Label>
              <Textarea id="descricao_fatos" value={form.descricao_fatos ?? ''} onChange={(e) => setForm({ ...form, descricao_fatos: e.target.value })} placeholder="Quando aconteceu, onde, como..." rows={3} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Gerar documentos</CardTitle><CardDescription>Clique para gerar. Revise antes de protocolar.</CardDescription></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {sugeridos.map((t) => (
              <Button key={t} variant="outline" disabled={gerando} onClick={() => gerar(t)}>📄 {t}</Button>
            ))}
          </CardContent>
        </Card>

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <div className="space-y-3">
          {docs.map((d) => (
            <Card key={d.id}>
              <CardHeader>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-base">{d.titulo}</CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => baixar(d)}>Baixar .md</Button>
                    <Button size="sm" onClick={() => baixarPDF(d)}>Baixar PDF</Button>
                  </div>
                </div>
                {d.variaveis_faltantes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {d.variaveis_faltantes.map((v) => <Badge key={v} className="bg-amber-50 text-amber-700 border-amber-200">Falta: {v}</Badge>)}
                  </div>
                )}
              </CardHeader>
              <CardContent><pre className="whitespace-pre-wrap text-sm bg-muted rounded-md p-4 max-h-96 overflow-auto">{d.conteudo_markdown}</pre></CardContent>
            </Card>
          ))}
          {docs.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Nenhum documento ainda. Gere o primeiro acima.</p>}
        </div>
      </div>
    </div>
  )
}
