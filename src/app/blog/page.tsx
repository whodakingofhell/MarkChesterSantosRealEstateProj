import { Metadata } from 'next';
import Link from 'next/link';
import { getAllBlogPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog - Philippine Skyland',
  description: 'Real estate tips, guides, and market insights for Philippine property buyers and investors.',
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <main className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <div className="bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-secondary-900 dark:text-white mb-4">Blog</h1>
          <p className="text-lg text-secondary-600 dark:text-secondary-400">
            Real estate tips, guides, and market insights for Philippine property professionals.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-secondary-500 dark:text-secondary-400 text-lg">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="bg-white dark:bg-secondary-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                  <span className="text-white text-lg font-bold px-6 text-center">{post.category}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/40 px-2 py-0.5 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-secondary-400">{post.date}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-secondary-600 dark:text-secondary-400 text-sm line-clamp-3">
                    {post.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-secondary-500">By {post.author}</span>
                    <span className="text-sm text-primary-600 hover:text-primary-700 font-medium">Read more →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
