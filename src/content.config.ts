import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string().min(1, '公告标题不能为空').max(84),
    description: z.string().min(1, '公告摘要不能为空').max(220),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(['赛事公告', '规则说明', '筹备日志']),
    pinned: z.boolean().default(false),
    author: z.string().default('赛事筹备组'),
  }),
});

const rules = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/rules' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    version: z.string().min(1),
    updatedAt: z.coerce.date(),
    status: z.enum(['sample', 'confirmed']).default('sample'),
    statusLabel: z.string().default('草案 · 待主办方确认'),
  }),
});

export const collections = { news, rules };
