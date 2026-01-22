import { addBtnListeners } from './cartService.js'
import { getProducts } from './productService.js'

// ===== Rendering products =====

export function renderProducts(products) {
  const albumsContainer = document.getElementById('products-container')
  
  if (!products || products.length === 0) {
    albumsContainer.innerHTML = '<p class="no-products">No products found.</p>'
    return
  }

  const cards = products.map((album) => {
    return `
      <div class="product-card">
        <img src="./images/${album.image}" alt="${album.title}">
        <h2>${album.title}</h2>
        <h3>${album.artist}</h3>
        <p>$${album.price}</p>
        <button class="main-btn add-btn" data-id="${album.id}">Add to Cart</button>
        <p class="genre-label">${album.genre}</p>
      </div>
    `
  }).join('')

  albumsContainer.innerHTML = cards
  addBtnListeners()
}

// ===== Handling filtering =====

export async function applySearchFilter() {
  try {
    const search = document.getElementById('search-input').value.trim()
    const genre = document.getElementById('genre-select').value
    
    const filters = {}
    if (search) filters.search = search
    if (genre) filters.genre = genre
    
    const products = await getProducts(filters)
    renderProducts(products)
  } catch (err) {
    console.error('Error applying search filter:', err)
    renderProducts([])
  }
}
