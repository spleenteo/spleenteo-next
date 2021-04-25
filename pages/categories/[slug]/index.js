import Head from "next/head";
import { renderMetaTags, useQuerySubscription } from "react-datocms";
import Container from "../../../components/container";
import Layout from "../../../components/layout";
import SiteNav from "../../../components/site-nav";
import PostPreview from '../../../components/post-preview'
import { request } from "../../../lib/datocms";
import PostTitle from '../../../components/post-title'
import { metaTagsFragment, responsiveImageFragment } from "../../../lib/fragments";

export async function getStaticPaths() {
  const data = await request({ query: `{ allCategories { slug id } }` });

  return {
    paths: data.allCategories.map((category) => `/categories/${category.slug}`),
    fallback: false,
  };
}

export async function getStaticProps({ params, preview = false }) {
  const graphqlRequest = {
    query: `
      query CategoryBySlug($slug: String, $id: ItemId) {
        site: _site {
          favicon: faviconMetaTags {
            ...metaTagsFragment
          }
        }
        category(filter: {slug: {eq: $slug}}) {
          name
          description
          slug
          seo: _seoMetaTags {
            ...metaTagsFragment
          }
        }
        allPosts(filter: {isPublic: {eq: true}, category: {eq: $id}}) {
          title
          excerpt
          slug
          date
          category{
            name
            slug
          }
          coverImage {
            responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 800, h: 800 }) {
              ...responsiveImageFragment
            }
          }

        }
      }
      ${metaTagsFragment}
      ${responsiveImageFragment}
    `,
    preview,
    variables: {
      slug: params.slug,
      id: params.id
    },
  };

  return {
    props: {
      subscription: preview
        ? {
            ...graphqlRequest,
            initialData: await request(graphqlRequest),
            token: process.env.NEXT_EXAMPLE_CMS_DATOCMS_API_TOKEN,
          }
        : {
            enabled: false,
            initialData: await request(graphqlRequest),
          },
    },
  };
}

export default function Category({ subscription, preview }) {
  const {
    data: { site, category, allPosts },
  } = useQuerySubscription(subscription);

  const metaTags = category.seo.concat(site.favicon);
  const articles = allPosts;

  return (
    <Layout preview={preview}>
      <Head>{renderMetaTags(metaTags)}</Head>
      <SiteNav />
      <Container>
        <PostTitle>{category.name}</PostTitle>
        <div className="mb-6" dangerouslySetInnerHTML={{__html: category.description}} />
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32 mb-32">

          {articles.map(post =>
            <PostPreview
              key={post.slug}
              title={post.title}
              coverImage={post.coverImage}
              date={post.date}
              author={post.author}
              slug={post.slug}
              excerpt={post.excerpt}
              category={post.category}
            />      
          )}
        </div>

      </Container>
    </Layout>
  );
}
