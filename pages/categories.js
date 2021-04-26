import Head from "next/head";
import { renderMetaTags, useQuerySubscription } from "react-datocms";
import CategoryAbstract from "../components/category-abstract";
import Container from "../components/container";
import Layout from "../components/layout";
import PostTitle from '../components/post-title';
import SiteNav from "../components/site-nav";
import { request } from "../lib/datocms";
import { metaTagsFragment } from "../lib/fragments";

export async function getStaticProps({ preview }) {
  const graphqlRequest = {
    query: `
      {
        site: _site {
          favicon: faviconMetaTags {
            ...metaTagsFragment
          }
        }
        categoryPage {
          title
          seo: _seoMetaTags {
            ...metaTagsFragment
          }
        }
        allCategories {
          name
          slug
          description
        }
      }

      ${metaTagsFragment}
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
    data: { categoryPage, allCategories, site },
  } = useQuerySubscription(subscription);

  const page = categoryPage;
  const metaTags = page.seo.concat(site.favicon);
  const categories = allCategories;
  // const morePosts = allPosts.slice(1);

  return (
    <>
      <Layout preview={subscription.preview}>
        <Head>{renderMetaTags(metaTags)}</Head>
        <SiteNav />
        <Container>
          <article>
            <PostTitle>{page.title}</PostTitle>
            <div className="grid grid-cols-2 gap-8">
              {categories.map(cat => (
                <CategoryAbstract
                  key={cat.slug}
                  name={cat.name}
                  description={cat.description}
                  slug={cat.slug}
                />
              ))}              
            </div>
          </article>

        </Container>
      </Layout>
    </>
  );
}
