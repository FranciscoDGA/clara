'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input, Label } from '@/components/ui/inputs'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(''); setLoading(true)
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('Serviço indisponível no momento. Tente novamente em instantes.')
      }
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
      if (error) throw error
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
        <CardHeader><CardTitle>Entrar na Clara</CardTitle><CardDescription>Acesse seus casos e documentos.</CardDescription></CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="email">E-mail</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" /></div>
            <div className="space-y-2"><Label htmlFor="senha">Senha</Label><Input id="senha" type="password" required value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••••" /></div>
            {erro && <p className="text-sm text-red-600">{erro}</p>}
            <Button className="w-full" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</Button>
            <p className="text-sm text-center text-muted-foreground">Sem conta? <Link href="/cadastro" className="text-clara-600 font-medium">Cadastre-se grátis</Link></p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
