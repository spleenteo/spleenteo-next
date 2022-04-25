import { request } from './datocms';

const query = `
  {
    allCategories {
      description
      id
      name
      slug
    }
    allPosts {
      category{
        id
      }
    }
  }
`;

const ActiveCategories = async() => {
  const result = await request({ query })
  const { allPosts, allCategories } = result

  const categories = allCategories.map(cat => {
    const matching = allPosts.filter(p => p.category.id == cat.id)
    return matching.length > 0 ? cat : null
  })
  const catsWithPosts = categories.filter(c => !!c)
  
  return catsWithPosts
}

export default ActiveCategories;
