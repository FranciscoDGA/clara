import { ImageResponse } from 'next/og'
import { POSTS } from '@/lib/blog'
import { getPost } from '@/lib/blog/types'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const CORES: Record<string, string> = {
  'Família': '#e11d48',
  'Violência': '#881337',
  'Trabalho': '#4f46e5',
  'Consumidor': '#d97706',
  'Direitos': '#047857',
}

export default function Image({ params }: { params: { slug: string } }) {
  const post = getPost(POSTS, params.slug)
  const cor = post ? (CORES[post.categoria] ?? '#be185d') : '#be185d'
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: `linear-gradient(135deg, ${cor}, #831843)`,
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 32, opacity: 0.85, marginBottom: 16 }}>
          Clara — Blog {post ? `• ${post.categoria}` : ''}
        </div>
        <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.15 }}>
          {post?.titulo ?? 'Blog da Clara'}
        </div>
        <div style={{ fontSize: 28, opacity: 0.9, marginTop: 24 }}>Seus direitos, claros.</div>
      </div>
    ),
    { ...size },
  )
}
