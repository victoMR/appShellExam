// Product data for different categories
const productsData = {
  papeleria: [
    {
      name: "Cuaderno Universitario",
      price: 25.99,
      description: "Cuaderno de 100 hojas con espiral, rayado universitario"
    },
    {
      name: "Set de Bolígrafos",
      price: 15.50,
      description: "Pack de 5 bolígrafos de diferentes colores"
    },
    {
      name: "Calculadora Científica",
      price: 89.99,
      description: "Calculadora científica con funciones avanzadas"
    }
  ],
  electronica: [
    {
      name: "Auriculares Bluetooth",
      price: 149.99,
      description: "Auriculares inalámbricos con cancelación de ruido"
    },
    {
      name: "Cargador Portátil",
      price: 45.00,
      description: "Power bank de 10000mAh con carga rápida"
    },
    {
      name: "Mouse Inalámbrico",
      price: 35.99,
      description: "Mouse ergonómico con sensor óptico de alta precisión"
    }
  ],
  snacks: [
    {
      name: "Mix de Frutos Secos",
      price: 12.99,
      description: "Mezcla de almendras, nueces y pasas"
    },
    {
      name: "Barra Energética",
      price: 8.50,
      description: "Barra de cereales con chocolate y proteínas"
    },
    {
      name: "Bebida Energizante",
      price: 6.75,
      description: "Bebida energética natural sin azúcar añadido"
    }
  ]
};

// App Shell class to manage the application
class AppShell {
  constructor() {
    this.currentCategory = 'papeleria';
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadProducts(this.currentCategory);
    this.registerServiceWorker();
  }

  setupEventListeners() {
    // Navigation links event listeners
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleNavigation(e.target);
      });
    });
  }

  handleNavigation(clickedLink) {
    // Remove active class from all links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });

    // Add active class to clicked link
    clickedLink.classList.add('active');

    // Get category and load products
    const category = clickedLink.getAttribute('data-category');
    this.currentCategory = category;
    this.loadProducts(category);
    this.updateCategoryTitle(category);
  }

  updateCategoryTitle(category) {
    const titleElement = document.getElementById('category-title');
    const titles = {
      papeleria: 'Papelería',
      electronica: 'Electrónica',
      snacks: 'Snacks'
    };
    titleElement.textContent = titles[category] || 'Productos';
  }

  async loadProducts(category) {
    const loadingElement = document.getElementById('loading');
    const productsGrid = document.getElementById('products-grid');

    // Show loading state
    loadingElement.style.display = 'block';
    productsGrid.innerHTML = '';

    // Simulate network delay
    await this.delay(500);

    // Hide loading and show products
    loadingElement.style.display = 'none';
    this.renderProducts(productsData[category] || []);
  }

  renderProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    
    if (products.length === 0) {
      productsGrid.innerHTML = '<p>No hay productos disponibles en esta categoría.</p>';
      return;
    }

    const productsHTML = products.map(product => `
      <div class="product-card fade-in">
        <div class="product-name">${product.name}</div>
        <div class="product-description">${product.description}</div>
        <div class="product-price">$${product.price.toFixed(2)}</div>
      </div>
    `).join('');

    productsGrid.innerHTML = productsHTML;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registrado exitosamente:', registration);
        
        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available, notify user
              this.showUpdateNotification();
            }
          });
        });
      } catch (error) {
        console.log('Error al registrar Service Worker:', error);
      }
    }
  }

  showUpdateNotification() {
    // Simple notification for new content
    if (confirm('Nueva versión disponible. ¿Deseas actualizar?')) {
      window.location.reload();
    }
  }
}

// Initialize the App Shell when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AppShell();
});

// Handle offline/online status
window.addEventListener('online', () => {
  console.log('Aplicación en línea');
  document.body.classList.remove('offline');
});

window.addEventListener('offline', () => {
  console.log('Aplicación fuera de línea');
  document.body.classList.add('offline');
});

// Export for potential testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AppShell, productsData };
}
