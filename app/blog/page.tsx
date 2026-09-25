import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/inputs'
import { POSTS } from '@/lib/blog'
import { CATEGORIAS, getAllPosts } from '@/lib/blog/types'

export const metadata = {
  title: 'Blog — Direitos da mulher explicados sem juridiquês | Clara',
  description: 'Guias práticos sobre pensão, guarda, divórcio, medida protetiva, direitos da gestante e mais. Conteúdo gratuito e atualizado.',
}

export default function BlogPage({ searchParams }: { searchParams?: { categoria?: string } }) {
  const cat = searchParams?.categoria
  const todos = getAllPosts(POSTS)
  const posts = cat ? todos.filter((p) => p.categoria === cat) : todos

  return (
    <div className="min-h-screen bg-clara-50 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Blog da Clara</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Direitos da mulher explicados sem juridiquês: pensão, guarda, divórcio, medida protetiva,
            trabalho e consumo. Leia e, se precisar, gere seus documentos.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Link href="/blog">
              <Badge className={!cat ? 'bg-clara-600 text-white border-clara-600' : 'bg-white'}>Todas</Badge>
            </Link>
            {CATEGORIAS.map((c) => (
              <Link key={c} href={`/blog?categoria=${encodeURIComponent(c)}`}>
                <Badge className={cat === c ? 'bg-clara-600 text-white border-clara-600' : 'bg-white'}>{c}</Badge>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-clara-50 text-clara-700 border-clara-200">{p.categoria}</Badge>
                    <span className="text-xs text-muted-foreground">{p.leituraMin} min</span>
                  </div>
                  <CardTitle className="text-lg leading-snug">{p.titulo}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{p.descricao}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-center text-muted-foreground">Nenhum post nesta categoria ainda.</p>
        )}
      </div>
    </div>
  )
}
