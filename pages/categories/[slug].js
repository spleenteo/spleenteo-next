import { metaTagsFragment, responsiveImageFragment } from "lib/fragments"
import { renderMetaTags, useQuerySubscription } from "react-datocms"
import { request } from "lib/datocms"
import Container from "components/container"
import Head from "next/head"
import Layout from "components/layout"
import PostGrid from "components/post-grid"
import PostTitle from 'components/post-title'
import SiteNav from "components/site-nav"

export async function getStaticPaths() {
  const data = await request({ query: `{ allCategories { slug id } }` });
  
  const paths = data.allCategories.map((category) => ({
    params: { slug: category.slug, id: category.id },
  }))

  return { paths, fallback: false };
}

export async function getStaticProps({ params, preview = false }) {
  const categories = await request({ query: `{ allCategories { slug id } }` });
  const category = categories.allCategories.find(cat => cat.slug == params.slug)

  const graphqlRequest = {
    query: `
      query CategoryBySlug($id: ItemId) {
        site: _site {
          favicon: faviconMetaTags {
            ...metaTagsFragment
          }
        }
        category(filter: {id: {eq: $id}}) {
          name
          description
          slug
          id
          seo: _seoMetaTags {
            ...metaTagsFragment
          }
        }
        posts: allPosts(orderBy: date_DESC, filter: {category: {eq: $id}}) {
          id
          title
          excerpt
          slug
          date
          category{
            name
            slug
          }
          tags{
            name
            slug
            id
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
      id: category.id
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
    data: { site, category, posts },
  } = useQuerySubscription(subscription);

  const metaTags = category.seo.concat(site.favicon);
  const articles = posts;

  return (
    <Layout preview={preview}>
      <Head>{renderMetaTags(metaTags)}</Head>
      <SiteNav />
      <Container>
        <PostTitle>{category.name}</PostTitle>
        <div className="mb-10 md:text-1xl lg:text-2xl md:leading-relaxed lg:w-2/3 xl:w-1/2" dangerouslySetInnerHTML={{__html: category.description}} />

        <PostGrid posts={articles} />
      </Container>
    </Layout>
  );
}
