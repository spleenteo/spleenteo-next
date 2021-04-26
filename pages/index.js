import Head from "next/head";
import { renderMetaTags, useQuerySubscription } from "react-datocms";
import Container from "../components/container";
import HeroPost from "../components/hero-post";
import Intro from "../components/intro";
import SiteNav from "../components/site-nav";
import Link from 'next/link'
import Layout from "../components/layout";
import MoreStories from "../components/more-stories";
import SectionSeparator from "../components/section-separator";
import PostPreview from '../components/post-preview'
import { request } from "../lib/datocms";
import { metaTagsFragment, responsiveImageFragment } from "../lib/fragments";

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
        allCategories {
          name
          slug
          description
        }
        allPosts(orderBy: date_DESC, first: 20, filter: {isPublic: { eq: true }}) {
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

      ${metaTagsFragment}
      ${responsiveImageFragment}
    `,
    preview,
  };

  return {
    props: {
      subscription: preview
        ? {
            ...graphqlRequest,
            initialData: await request(graphqlRequest),
            token: process.env.NEXT_EXAMPLE_CMS_DATOCMS_API_TOKEN,
            environment: process.env.NEXT_DATOCMS_ENVIRONMENT || null,
          }
        : {
            enabled: false,
            initialData: await request(graphqlRequest),
          },
    },
  };
}

export default function Index({ subscription }) {
  const {
    data: { allPosts, allCategories, site, blog },
  } = useQuerySubscription(subscription);

  console.log(allPosts.slice(2))
  const heroPost = allPosts[0];
  const higlights = [allPosts[1], allPosts[2]];
  const morePosts = allPosts.slice(3);
  const metaTags = blog.seo.concat(site.favicon);
  const categories = allCategories;

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
              />
            ))}
          </div>


          {morePosts.length > 0 && <MoreStories posts={morePosts} categories={categories} />}
        </Container>
      </Layout>
    </>
  );
}
