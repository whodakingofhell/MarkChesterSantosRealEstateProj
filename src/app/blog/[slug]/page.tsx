import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogPost, getBlogSlugs } from '@/lib/blog';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: 'Not Found' };

  return {
    title: `${post.title} - Philippine Skyland`,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      siteName: 'Philippine Skyland',
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Philippine Skyland MGT and DEVT OPC',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://philippine-skyland.vercel.app/blog/${post.slug}`,
    },
  };

  function renderMarkdown(content: string): string {
    return content
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-secondary-900 dark:text-white mt-8 mb-3">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-secondary-900 dark:text-white mt-10 mb-4">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-secondary-900 dark:text-white mb-6">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-secondary-900 dark:text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-secondary-100 dark:bg-secondary-700 px-1.5 py-0.5 rounded text-sm">$1</code>')
      .replace(/^\| (.*?) \|$/gm, (match) => {
        const cells = match.split('|').filter(Boolean).map((c) => c.trim());
        return `<tr>${cells.map((c) => `<td class="border border-secondary-200 dark:border-secondary-700 px-4 py-2">${c}</td>`).join('')}</tr>`;
      })
      .replace(/^---$/gm, '<hr class="my-8 border-secondary-200 dark:border-secondary-700" />')
      .replace(/^- (.*$)/gm, '<li class="ml-6 mb-1">$1</li>')
      .replace(/^[0-9]+\. (.*$)/gm, '<li class="ml-6 mb-1 list-decimal">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4 text-secondary-700 dark:text-secondary-300 leading-relaxed">')
      .replace(/\n/g, '<br/>');
  }

  return (
    <main className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700">
        <div className="container mx-auto px-4 py-3">
          <nav className="text-sm text-secondary-600 dark:text-secondary-400">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-primary-600">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-secondary-900 dark:text-white">{post.title}</span>
          </nav>
        </div>
      </div>

      <article className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium text-primary-600 bg-primary-100 dark:bg-primary-900/40 px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-sm text-secondary-400">{post.date}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
            {post.title}
          </h1>

          <p className="text-secondary-600 dark:text-secondary-400 mb-6 text-lg">
            {post.description}
          </p>

          <div className="flex items-center gap-2 mb-8 pb-6 border-b border-secondary-200 dark:border-secondary-700">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/40 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-bold">{post.author.split(' ').map((n) => n[0]).join('')}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-secondary-900 dark:text-white">{post.author}</p>
              <p className="text-xs text-secondary-500">Licensed Real Estate Broker</p>
            </div>
          </div>

          <div
            className="prose prose-lg max-w-none text-secondary-700 dark:text-secondary-300"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
          />

          <div className="mt-10 pt-6 border-t border-secondary-200 dark:border-secondary-700">
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">
              Need personalized advice? Contact Nelson Aczon:
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="tel:+639174722107" className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                Call: +63 917 472 2107
              </a>
              <a href="mailto:nelsonaczon@gmail.com" className="px-4 py-2 bg-secondary-200 dark:bg-secondary-700 text-secondary-900 dark:text-white rounded-lg text-sm font-medium hover:bg-secondary-300 dark:hover:bg-secondary-600 transition-colors">
                Email: nelsonaczon@gmail.com
              </a>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
