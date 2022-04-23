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
  const data = await request({ query: `{ allTags { slug id } }` });
  
  const paths = data.allTags.map((tag) => ({
    params: { slug: tag.slug, id: tag.id },
  }))

  return { paths, fallback: false };
}

export async function getStaticProps({ params, preview = false }) {
  const tags = await request({ query: `{ allTags { slug id } }` });
  const tag = tags.allTags.find(tag => tag.slug == params.slug)

  const graphqlRequest = {
    query: `
      query TagsBySlug($id: ItemId) {
        site: _site {
          favicon: faviconMetaTags {
            ...metaTagsFragment
          }
        }
        tag(filter: {id: {eq: $id}}) {
          name
          description
          slug
          id
          seo: _seoMetaTags {
            ...metaTagsFragment
          }
        }
        posts: allPosts(orderBy: date_DESC, filter: {tags: {allIn: [$id]}}) {
          title
          excerpt
          slug
          date
          category{
            name
            slug
          }
          tags{
            id
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
      id: tag.id
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

export default function Tag({ subscription, preview }) {
  const {
    data: { site, tag, posts },
  } = useQuerySubscription(subscription);

  const metaTags = tag.seo.concat(site.favicon);
  const articles = posts;

  return (
    <Layout preview={preview}>
      <Head>{renderMetaTags(metaTags)}</Head>
      <SiteNav />
      <Container>
        <PostTitle>{tag.name}</PostTitle>
        <div className="mb-10 md:text-1xl lg:text-2xl md:leading-relaxed lg:w-2/3 xl:w-1/2" dangerouslySetInnerHTML={{__html: tag.description}} />
        <PostGrid posts={articles} />
      </Container>
    </Layout>
  );
}
