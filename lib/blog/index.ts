import type { Post } from './types'
import { POSTS_A } from './posts-a'
import { POSTS_B } from './posts-b'
import { POSTS_C } from './posts-c'

export const POSTS: Post[] = [...POSTS_A, ...POSTS_B, ...POSTS_C]
