import Head from "next/head";
import { renderMetaTags, useQuerySubscription } from "react-datocms";
import Container from "../../../components/container";
import Header from "../../../components/header";
import Layout from "../../../components/layout";
import SiteNav from "../../../components/site-nav";

import MoreStories from "../../../components/more-stories";
import PostBody from "../../../components/post-body";
import PostHeader from "../../../components/post-header";
import SiteHeader from "../../../components/site-header";
import SectionSeparator from "../../../components/section-separator";
import { request } from "../../../lib/datocms";
import { metaTagsFragment, responsiveImageFragment } from "../../../lib/fragments";
import CategoryAbstract from "../../../components/category-abstract";

export async function getStaticPaths() {
  const data = await request({ query: `{ allCategories { slug } }` });

  return {
    paths: data.allCategories.map((category) => `/categories/${category.slug}`),
    fallback: false,
  };
}

export async function getStaticProps({ params, preview = false }) {
  const graphqlRequest = {
    query: `
      query CategoryBySlug($slug: String) {
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
      }

      ${metaTagsFragment}
    `,
    preview,
    variables: {
      slug: params.slug
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
    data: { site, category },
  } = useQuerySubscription(subscription);

  const metaTags = category.seo.concat(site.favicon);

  return (
    <Layout preview={preview}>
      <Head>{renderMetaTags(metaTags)}</Head>
      <SiteNav />
      <Container>
        <SectionSeparator />
        
        <CategoryAbstract
          key={category.slug}
          name={category.name}
          description={category.description}
          slug={category.slug}
        />
        <SectionSeparator />
      </Container>
    </Layout>
  );
}
