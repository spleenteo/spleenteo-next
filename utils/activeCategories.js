export default function activeCategories(allCategories, posts) {
  // posts: IDs, Category required
  // allCategories: IDs required
  
  const categories = []

  allCategories.map(cat => {
    let categoryPostsCounter = 0;    
    posts.map(post => {
      if(post.category.id == cat.id){
        categoryPostsCounter++;
      }
    });
    if(categoryPostsCounter > 0){
      categories.push(cat);
    }
  });

  return categories;
}
