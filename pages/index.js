import { metaTagsFragment, responsiveImageFragment } from "lib/fragments"
import { renderMetaTags, useQuerySubscription } from "react-datocms"
import { request } from "lib/datocms"
import activeCategories from 'lib/activeCategories'
import activeTags from 'lib/activeTags'
import Container from "components/container"
import Head from "next/head"
import HeroPost from "components/hero-post"
import Intro from "components/intro"
import Layout from "components/layout"
import MoreStories from "components/more-stories"
import PostPreview from 'components/post-preview'
import SiteNav from "components/site-nav";

export async function getStaticProps({ preview }) {
  const graphqlRequest = {
    query: `
      {
        site: _site {
          favicon: faviconMetaTags {
            ...metaTagsFragment
          }
        }
        blog {
          title
          subtitle  
          seo: _seoMetaTags {
            ...metaTagsFragment
          }
        }
        allPosts(orderBy: date_DESC) {
          title
          slug
          excerpt
          date
          id
          coverImage {
            responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 2000, h: 1000 }) {
              ...responsiveImageFragment
            }
          }
          category{
            name
            slug
            id
          }
          tags{
            name
            slug
            id
          }
        }
      }

      ${metaTagsFragment}
      ${responsiveImageFragment}
    `,
    preview,
  };

  const categories = await activeCategories()
  const tags = await activeTags()
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

const Index = function({ subscription, categories }) {
  const {
    data: { allPosts, site, blog },
  } = useQuerySubscription(subscription);

  const heroPost = allPosts[0];
  const higlights = [allPosts[1], allPosts[2]];
  const morePosts = allPosts.slice(3);
  const metaTags = blog.seo.concat(site.favicon);

  return (
    <>
      <Layout preview={subscription.preview}>
        <Head>{renderMetaTags(metaTags)}</Head>
        <SiteNav />
        <Container>
          <Intro
            title={blog.title}
            subtitle={blog.subtitle} />
          {heroPost && (
            <HeroPost
              title={heroPost.title}
              coverImage={heroPost.coverImage}
              date={heroPost.date}
              slug={heroPost.slug}
              excerpt={heroPost.excerpt}
              category={heroPost.category}
              tags={heroPost.tags}
            />
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32 mb-32">
            {higlights.map(post => (
              <PostPreview
                key={post.slug}
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={post.author}
                slug={post.slug}
                excerpt={post.excerpt}
                category={post.category}
                tags={post.tags}
              />
            ))}
          </div>


          {morePosts.length > 0 && <MoreStories posts={morePosts} categories={categories} />}
        </Container>
      </Layout>
    </>
  );
}

export default Index;