// pages/post/[id].tsx
import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import api from '../../../api';

type Post = {
  id: number;
  attributes: {
    title: string;
    content: string;
    publishDate: string;
  };
};

type PostPageProps = {
  post: Post;
};

export default function PostPage({ post }: PostPageProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Head>
        <title>{post.attributes.title}</title>
      </Head>
      <main>
        <h1 className="text-4xl font-bold">{post.attributes.title}</h1>
        <p>{post.attributes.publishDate}</p>
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: post.attributes.content }}
        ></div>
      </main>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get('/posts');
  const posts: Post[] = data.data;

  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params as { id: string };

  const { data } = await api.get(`/posts/${id}`);
  const post: Post = data.data;

  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};
