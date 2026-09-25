export interface Post {
  slug: string
  titulo: string
  descricao: string
  categoria: 'Família' | 'Violência' | 'Trabalho' | 'Consumidor' | 'Direitos'
  data: string // ISO
  leituraMin: number
  conteudo: string // HTML (h2/p/ul/ol/strong — o h1 é o título da página)
}

export const CATEGORIAS: Post['categoria'][] = ['Família', 'Violência', 'Trabalho', 'Consumidor', 'Direitos']

export function getAllPosts(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => b.data.localeCompare(a.data))
}

export function getPost(posts: Post[], slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug)
}

export function getRelacionados(posts: Post[], atual: Post, n = 3): Post[] {
  const mesma = posts.filter((p) => p.slug !== atual.slug && p.categoria === atual.categoria)
  const outros = posts.filter((p) => p.slug !== atual.slug && p.categoria !== atual.categoria)
  return [...mesma, ...outros].slice(0, n)
}
