# Clara — Seus Direitos, Claros 💜
Navegadora de direitos da mulher: triagem por IA + documentos jurídicos + passo a passo.

## Stack
Next.js 14 (App Router) • Supabase (Postgres + Auth + RLS) • Vercel • WhatsApp Business API

## Rodar local
```bash
npm install
cp .env.example .env.local  # preencha SUPABASE_URL + ANON_KEY
npm run dev                 # http://localhost:3000
```

## Supabase (criar projeto grátis)
1. https://supabase.com → New project
2. SQL Editor → cole `supabase/migrations/20260918000000_init.sql` → Run
3. Authentication → ative Email + (opcional) Google
4. Copie URL + anon key para `.env.local`
5. Deploy: conecte o repo no Vercel e configure as env vars

## Deploy Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
- Root: `./`
- Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Região: `gru1` (vercel.json já configurado)

## Rotas
- `/` landing • `/triagem` triagem gratuita (sem login) • `/login` `/cadastro`
- `/dashboard` meus casos • `/casos/[id]` gerar documentos
- `POST /api/triagem` (Edge, sem auth) • `POST /api/casos` • `GET /api/casos/[id]`
- `POST /api/casos/[id]/documentos` • `GET/POST /api/webhook/whatsapp` • `GET /api/health`

## Aviso legal
Documentos-base para levar à Defensoria/advogada. Não substitui orientação jurídica individual. Em risco: 180 / 190.
