import Head from "next/head";
import { renderMetaTags, useQuerySubscription } from "react-datocms";
import Container from "../components/container";
import Intro from "../components/intro";
import Layout from "../components/layout";
import Header from "../components/header";
import PostHeader from "../components/post-header";
import PostBody from "../components/post-body";
import PostTitle from '../components/post-title'
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
        }
        about {
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
          seo: _seoMetaTags {
            ...metaTagsFragment
          }
          slug
          title
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
    data: { about, site, blog },
  } = useQuerySubscription(subscription);

  const metaTags = about.seo.concat(site.favicon);
  // const morePosts = allPosts.slice(1);
  // const categories = allCategories;

  return (
    <>
      <Layout preview={subscription.preview}>
        <Head>{renderMetaTags(metaTags)}</Head>
        <Container>
          <Intro
            title={blog.title}
            subtitle={blog.subtitle}
          />
          <article>
            <PostTitle>{about.title}</PostTitle>
            <PostBody content={about.content} />
          </article>

          <SectionSeparator />
        </Container>
      </Layout>
    </>
  );
}
