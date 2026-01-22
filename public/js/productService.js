// ===== Fetching products =====

export async function getProducts(filters = {}) {
  try {
    const queryParams = new URLSearchParams(filters)
    const res = await fetch(`/api/products?${queryParams}`)
    
    if (!res.ok) {
      console.error('Failed to fetch products:', res.status)
      return []
    }
    
    const products = await res.json()
    return Array.isArray(products) ? products : []
  } catch (err) {
    console.error('Error fetching products:', err)
    return []
  }
}

// ===== Populate the genre dropdown =====

export async function populateGenreSelect() {
  try {
    const res = await fetch('/api/products/genres')
    
    if (!res.ok) {
      console.error('Failed to fetch genres:', res.status)
      return
    }
    
    const genres = await res.json()
    const select = document.getElementById('genre-select')

    // Clear existing options except the first one
    while (select.options.length > 1) {
      select.remove(1)
    }

    genres.forEach(genre => {
      const option = document.createElement('option')
      option.value = genre
      option.textContent = genre
      select.appendChild(option)
    })
  } catch (err) {
    console.error('Error populating genres:', err)
  }
}