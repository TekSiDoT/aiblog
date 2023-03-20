// pages/index.tsx
import Head from 'next/head';
import Link from 'next/link';
import api from '../../api';
import type { GetStaticProps } from 'next';

type Post = {
  id: number;
  attributes: {
    title: string;
    content: string;
    publishDate: string;
  };
};


type HomeProps = {
  posts: Post[];
};

export default function Home({ posts }: HomeProps) {
  return (
    <div>
      <Head>
        <title>AI Blog</title>
      </Head>
      <main>
        <h1 className="text-4xl font-bold">Latest Posts</h1>
        <div>
          {posts.map((post) => (
            <div key={post.id} className="mb-4">
              <h2 className="text-2xl font-semibold">
                <Link href={`/post/${post.id}`} passHref>
                  <span className="cursor-pointer hover:underline">{post.attributes.title}</span>
                </Link>
              </h2>
              <p>{post.attributes.publishDate}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  let posts = [];

  try {
    const response = await api.get('/posts');
    if (Array.isArray(response.data.data)) {
      posts = response.data.data;
    } else {
      console.error('Unexpected API response structure');
    }
  } catch (error) {
    console.error('API request failed:', error);
  }

  return {
    props: {
      posts,
    },
    revalidate: 60,
  };
};
