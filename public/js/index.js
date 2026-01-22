import { logout } from './logout.js'
import { checkAuth, renderGreeting, showHideMenuItems } from './authUI.js'
import { getProducts, populateGenreSelect } from './productService.js'
import { renderProducts, applySearchFilter } from './productUI.js'
import { updateCartIcon } from './cartService.js'

document.getElementById('logout-btn').addEventListener('click', logout)

// ===== Initial Load =====

async function init() {
  try {
    await populateGenreSelect()
    const products = await getProducts()
    const name = await checkAuth()
    renderGreeting(name)
    renderProducts(products)
    showHideMenuItems(name)
    if (name) {
      await updateCartIcon()
    }
  } catch (err) {
    console.error('Error during initialization:', err)
  }
}

init()

// ===== Event Listeners =====

document.getElementById('search-input').addEventListener('input', (e) => {
  applySearchFilter()
})

// prevent 'enter' from submitting
document.getElementById('search-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault()
  }
})

document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault()
  applySearchFilter() 
})

document.getElementById('genre-select').addEventListener('change', async (e) => {
  try {
    const genre = e.target.value
    // Clear search when changing genre
    document.getElementById('search-input').value = ''
    const products = await getProducts(genre ? { genre } : {})
    renderProducts(products)
  } catch (err) {
    console.error('Error changing genre:', err)
    renderProducts([])
  }
})