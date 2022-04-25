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
import Script from 'next/script'

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
          tags {
            name
            id
            slug
          }
          content {
            value
            links {
              __typename
              ... on PostRecord {
                id
                slug
                title
              }
              ... on CategoryRecord {
                id
                slug
                name
              }
            }
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
              ... on IframeBlockRecord {
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
          tags{
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

const Post = function({ subscription, preview, categories }) {
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
              tags={post.tags}
              />
          </div>          
          <PostBody content={post.content} />
        </article>
        <div id="graphcomment" />
        <Script src="https://graphcomment.com/js/integration.js" strategy="beforeInteractive" />
        <Script strategy="lazyOnload" dangerouslySetInnerHTML={{ __html: `
          var gc_params = {
            graphcomment_id: 'spleenteo',
            target: document.getElementById('#graphcomment'), // optional, #graphcomment by default
          };
          window.graphcomment(gc_params);`,
        }}/>

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

export default Post;