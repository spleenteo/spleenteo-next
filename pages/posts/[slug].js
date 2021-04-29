import { metaTagsFragment, responsiveImageFragment } from "lib/fragments"
import { renderMetaTags, useQuerySubscription } from "react-datocms"
import { request } from "lib/datocms"
import activeCategories from 'lib/activeCategories'
import CategoryAbstract from "components/category-abstract"
import Container from "components/container"
import Head from "next/head"
import Layout from "components/layout"
import MoreStories from "components/more-stories"
import PostBody from "components/post-body"
import PostHeader from "components/post-header"
import PostMeta from 'components/post-meta'
import SectionSeparator from "components/section-separator"
import SiteNav from "components/site-nav"

export async function getStaticPaths() {
  const data = await request({ query: `{ allPosts { slug } }` })

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
                  responsiveImage(imgixParams: {fm: jpg, fit: clip, w: 1000, h: 600 }) {
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
              ... on SoundcloudBlockRecord {
                id
                url
              }
              ... on SpotifyBlockRecord {
                id
                url
              }
              ... on PodcastBlockRecord {
                id
                url
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

  const categories = await activeCategories()
  const initialData = await request(graphqlRequest)

  let subscription = null
  if(preview){
    subscription = {
      ...graphqlRequest,
      initialData,
      token: process.env.NEXT_EXAMPLE_CMS_DATOCMS_API_TOKEN,
      environment: process.env.NEXT_DATOCMS_ENVIRONMENT || null,
    }
  } else {
    subscription = {
      enabled: false,
      initialData,
    }
  }

  return {
    props: {
      subscription,
      categories
    },
  }
}

export default ({ subscription, preview, categories }) => {
  const {
    data: { site, post, morePosts },
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
          />
          <div className="mb-8 max-w-2xl mx-auto">
            <PostMeta
              category={post.category}
              date={post.date}
            />
          </div>          
          <PostBody content={post.content} />
        </article>
        <SectionSeparator />
        <CategoryAbstract
                key={post.category.slug}
                name={post.category.name}
                description={post.category.description}
                slug={post.category.slug}
        />
        <SectionSeparator />
        {morePosts.length > 0 && <MoreStories posts={morePosts} categories={categories} />}
      </Container>
    </Layout>
  );
}
