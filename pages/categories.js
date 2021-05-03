import { metaTagsFragment } from "lib/fragments"
import { renderMetaTags, useQuerySubscription } from "react-datocms"
import { request } from "lib/datocms"
import activeCategories from 'lib/activeCategories'
import activeTags from 'lib/activeTags'
import CategoryAbstract from "components/category-abstract"
import Container from "components/container"
import Head from "next/head"
import Layout from "components/layout"
import Link from 'next/link'
import PostTitle from 'components/post-title'
import SiteNav from "components/site-nav"


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
        allPosts(filter: {isPublic: {eq: true}}) {
          id
          category {
            id
          }
        }
      }

      ${metaTagsFragment}
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
      categories,
      tags
    },
  }
}

export default function Index({ subscription, categories, tags }) {
  const {
    data: { categoryPage, site },
  } = useQuerySubscription(subscription);

  const page = categoryPage;
  const metaTags = page.seo.concat(site.favicon);

  return (
    <>
      <Layout preview={subscription.preview}>
        <Head>{renderMetaTags(metaTags)}</Head>
        <SiteNav />
        <Container>
          <article>
            <PostTitle>{page.title}</PostTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-8 md:gap-x-2">
              <div className="col-span-3 md:col-span-2 lg:col-span-6 md:mr-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {categories.map(cat => (
                    <CategoryAbstract
                      key={cat.slug}
                      name={cat.name}
                      description={cat.description}
                      slug={cat.slug}
                    />
                  ))}              
                </div>
              </div>
              <div className="col-span-3 md:col-span-1 lg:col-span-2 bg-gray-100 p-8 rounded">
                <h2 className="mb-8 text-4sm md:text-2xl font-bold tracking-tighter leading-tight">Parlo anche di:</h2>
                <ul className="flex flex-wrap my-8">
                  {tags.map(tag => (
                    <li className="mb-3 mr-3 rounded-md bg-green-500 text-white flex font-bold p-1 px-4">
                      <Link as={`/tags/${tag.slug}`} href="/tags/[slug]">
                        <a className="hover:underline">{tag.name}</a>
                      </Link>
                    </li>
                  ))}       
                </ul>
              </div>
            </div>
          </article>
        </Container>
      </Layout>
    </>
  );
}
