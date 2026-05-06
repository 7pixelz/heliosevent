import GetQuoteClient from './GetQuoteClient';
import { getPageSeo, buildMeta } from '../../../lib/seo';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('get-quote');
  return buildMeta({ title: seo?.metaTitle, description: seo?.metaDescription, keywords: seo?.metaKeywords, path: '/get-quote' });
}

export default function GetQuotePage() {
  return <GetQuoteClient />;
}
