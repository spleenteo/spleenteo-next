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

  const heroPost = allPosts[0];
  const higlights = allPosts[1];
  const morePosts = allPosts.slice(1);
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
          {higlights.length > 0 && <MoreStories posts={higlights} />}
          <ul className="flex flex-row space-x-4 my-8">
            {categories.map(cat =>
              <li className="rounded-md bg-green-500 text-white flex items-center justify-center text-2xl font-bold rounded-t-xl p-2 px-4">
                <Link as={`/categories/${cat.slug}`} href="/categories/[slug]">
                  <a className="hover:underline">{cat.name}</a>
                </Link>
              </li>
            )}
          </ul>
          {morePosts.length > 0 && <MoreStories posts={morePosts} />}
        </Container>
      </Layout>
    </>
  );
}
