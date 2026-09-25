'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input, Label } from '@/components/ui/inputs'

export default function CadastroPage() {
  const router = useRouter()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [ok, setOk] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(''); setOk(''); setLoading(true)
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('Serviço indisponível no momento. Tente novamente em instantes.')
      }
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email, password: senha,
        options: { data: { nome } },
      })
      if (error) throw error
      // Sem sessão = confirmação de e-mail ativada: avisa em vez de travar no dashboard.
      if (!data.session) {
        setOk('Conta criada! Verifique seu e-mail para confirmar e depois entre.')
        return
      }
      router.push('/dashboard')
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : 'Erro inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-clara-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader><CardTitle>Criar conta grátis</CardTitle><CardDescription>1 caso ativo, 2 documentos/mês, sem cartão.</CardDescription></CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="nome">Seu nome</Label><Input id="nome" required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Maria Silva" /></div>
            <div className="space-y-2"><Label htmlFor="email">E-mail</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" /></div>
            <div className="space-y-2"><Label htmlFor="senha">Senha (mín. 6)</Label><Input id="senha" type="password" required minLength={6} value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••••" /></div>
            {erro && <p className="text-sm text-red-600">{erro}</p>}
            {ok && <p className="text-sm text-green-700">{ok}</p>}
            <Button className="w-full" disabled={loading}>{loading ? 'Criando...' : 'Criar conta'}</Button>
            <p className="text-sm text-center text-muted-foreground">Já tem conta? <Link href="/login" className="text-clara-600 font-medium">Entrar</Link></p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
