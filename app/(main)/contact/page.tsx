import ContactPageClient from './ContactPageClient';
import { getPageSeo, buildMeta } from '../../../lib/seo';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('contact');
  return buildMeta({ title: seo?.metaTitle, description: seo?.metaDescription, keywords: seo?.metaKeywords, path: '/contact' });
}

export default function ContactPage() {
  return <ContactPageClient />;
}
