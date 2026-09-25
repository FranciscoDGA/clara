import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Scale } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/inputs'
import { CapaPost } from '@/components/blog-capa'
import { POSTS } from '@/lib/blog'
import { getPost, getRelacionados } from '@/lib/blog/types'

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPost(POSTS, params.slug)
  if (!post) return {}
  return {
    title: `${post.titulo} | Blog da Clara`,
    description: post.descricao,
    openGraph: { title: post.titulo, description: post.descricao, type: 'article' },
  }
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(POSTS, params.slug)
  if (!post) notFound()
  const relacionados = getRelacionados(POSTS, post)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.titulo,
    description: post.descricao,
    datePublished: post.data,
    author: { '@type': 'Organization', name: 'Clara — Seus Direitos, Claros' },
    inLanguage: 'pt-BR',
  }

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-3xl px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-clara-600 text-white"><Scale size={20} /></span>
            Clara
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/blog"><Button variant="ghost" size="sm">← Blog</Button></Link>
            <Link href="/triagem"><Button size="sm">Fazer triagem</Button></Link>
          </nav>
        </div>
      </header>
      <article className="mx-auto max-w-3xl px-4 py-10">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-clara-50 text-clara-700 border-clara-200">{post.categoria}</Badge>
          <span className="text-xs text-muted-foreground">
            {new Date(post.data + 'T12:00:00').toLocaleDateString('pt-BR')} • {post.leituraMin} min de leitura
          </span>
        </div>
        <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-balance">{post.titulo}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{post.descricao}</p>
        <CapaPost categoria={post.categoria} semente={post.slug} className="mt-6 h-56 md:h-64 rounded-xl" iconSize={64} />

        <div
          className="post-conteudo mt-8 space-y-4 text-[1.05rem] leading-relaxed text-neutral-800 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:pt-4 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:space-y-1.5 [&_a]:text-clara-700 [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: post.conteudo }}
        />

        <Card className="mt-10 bg-clara-50 border-clara-200">
          <CardHeader><CardTitle>Precisa aplicar isso no seu caso?</CardTitle></CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-2">
            <Link href="/triagem"><Button>Fazer triagem gratuita</Button></Link>
            <Link href="/checklist"><Button variant="outline">Ver checklist e endereços</Button></Link>
          </CardContent>
        </Card>

        <p className="mt-6 text-xs text-muted-foreground">
          Aviso: conteúdo informativo e geral, não substitui orientação jurídica individual. Para o seu caso,
          leve os documentos gerados pela Clara à Defensoria Pública ou advogada.
        </p>

        {relacionados.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">Leia também</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {relacionados.map((r) => (
                <Link key={r.slug} href={`/blog/${r.slug}`}>
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <Badge className="bg-clara-50 text-clara-700 border-clara-200 mb-2">{r.categoria}</Badge>
                      <p className="font-semibold text-sm leading-snug">{r.titulo}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
