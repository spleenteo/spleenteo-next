import Head from "next/head";
import { renderMetaTags, useQuerySubscription } from "react-datocms";
import Container from "../../components/container";
import Layout from "../../components/layout";
import MoreStories from "../../components/more-stories";
import PostBody from "../../components/post-body";
import SiteNav from "../../components/site-nav";
import PostHeader from "../../components/post-header";
import SectionSeparator from "../../components/section-separator";
import { request } from "../../lib/datocms";
import { metaTagsFragment, responsiveImageFragment } from "../../lib/fragments";

export async function getStaticPaths() {
  const data = await request({ query: `{ allPosts { slug } }` });

  const paths = data.allPosts.map((post) => ({
    params: { slug: post.slug },
  }))

  return { paths, fallback: false };
}

export async function getStaticProps({ params, preview = false }) {
  const graphqlRequest = {
    query: `
      query PostBySlug($slug: String) {
        site: _site {
          favicon: faviconMetaTags {
            ...metaTagsFragment
          }
        }
        post(filter: {slug: {eq: $slug}}) {
          seo: _seoMetaTags {
            ...metaTagsFragment
          }
          title
          slug
          content {
            value
            blocks {
              __typename
              ...on ImageBlockRecord {
                id
                image {
                  responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 2000, h: 1000 }) {
                    ...responsiveImageFragment
                  }
                }
              }
              ... on VideoBlockRecord {
                id
                video {
                  url
                  thumbnailUrl
                }
              }
            }
          }
          date
          ogImage: coverImage{
            url(imgixParams: {fm: jpg, fit: crop, w: 2000, h: 1000 })
          }
          coverImage {
            responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 2000, h: 1000 }) {
              ...responsiveImageFragment
            }
          }
          category{
            name
            description
            slug
          }
        }
        categories: allCategories{
          slug
          name
        }
        morePosts: allPosts(orderBy: date_DESC, first: 2, filter: {slug: {neq: $slug}}) {
          title
          slug
          excerpt
          date
          coverImage {
            responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 2000, h: 1000 }) {
              ...responsiveImageFragment
            }
          }
          category{
            name
            slug
          }
        }
      }

      ${responsiveImageFragment}
      ${metaTagsFragment}
    `,
    preview,
    variables: {
      slug: params.slug,
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

export default function Post({ subscription, preview }) {
  const {
    data: { site, post, morePosts, categories },
  } = useQuerySubscription(subscription);

  const metaTags = post.seo.concat(site.favicon);

  return (
    <Layout preview={preview}>
      <Head>{renderMetaTags(metaTags)}</Head>
      <SiteNav />
      <Container>
        <article>
          <PostHeader
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
          />
          <PostBody content={post.content} />
        </article>
        <SectionSeparator />
        <div>
          <h4 className="mb-8 text-3xl md:text-3xl font-bold tracking-tighter leading-tight">{post.category.name}</h4>
          <div dangerouslySetInnerHTML={{__html: post.category.description}} />
        </div>
        <SectionSeparator />
        {morePosts.length > 0 && <MoreStories posts={morePosts} categories={categories} />}
      </Container>
    </Layout>
  );
}
