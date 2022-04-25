import { request } from './datocms';

const query = `
  {
    allTags {
      id
      name
      slug
    }
    allPosts {
      tags{
        id
      }
    }
  }
`;

export default async() => {
  const result = await request({ query })
  const { allPosts, allTags } = result
  const tags =[]

  allTags.map(tag => {
    allPosts.forEach(p => {
      // se un tag è presente, aggiugilo ad un array di tag
      const matching = p.tags.filter(t => t.id == tag.id)
      
      if(matching.length > 0){
        // controlla che non esistea già
        tags.push(tag)    
      }
    })
  })
  const tagsWithPosts = tags.filter((n,i) => tags.indexOf(n)===i)  
  return tagsWithPosts
}
