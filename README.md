# GlowHer Clothing Store 👗

A responsive, single-page e-commerce web application for women's fashion — built with vanilla HTML, CSS (Tailwind), and JavaScript.

---

## 🌟 Features

- **Product Catalog** — Browse hundreds of products across multiple categories fetched live from the DummyJSON API
- **Category Filtering** — Filter by Clothing, Footwear, or Accessories
- **Search** — Search products by name, description, or category
- **Product Detail View** — View product info and select quantity before adding to cart
- **Shopping Cart** — Add, remove, and adjust item quantities with live price calculation
- **Checkout** — Shipping + payment form with real-time validation (email format, 16-digit card number)
- **Order Confirmation** — Modal with a generated order number on successful checkout
- **Login / Register** — Modal-based auth with basic validation (session-only, no backend)
- **Responsive Design** — Mobile-friendly layout using Tailwind CSS

---

## 🗂️ Project Structure

```
GlowHer/
├── index.html     # Main HTML file — layout, sections, modals
└── script.js      # All app logic — products, cart, auth, navigation
```

---

## 🚀 Getting Started

No build tools or installation required.

1. Clone or download this repository
2. Open `index.html` in your browser

```bash
git clone https://github.com/your-username/glowher.git
cd glowher
open index.html
```

> An internet connection is required to load products (DummyJSON API), Tailwind CSS, and Font Awesome icons.

---

## 🛍️ Product Categories

| Category     | Sources (DummyJSON)                              |
|--------------|--------------------------------------------------|
| Clothing     | Dresses, Tops, Shirts, Jackets, Jeans            |
| Footwear     | Women's Shoes                                    |
| Accessories  | Bags, Jewellery, Sunglasses                      |

---

## 💳 Checkout Validation

- All shipping fields are required
- Email must follow a valid format (e.g. `you@example.com`)
- Card number must be exactly 16 digits

> ⚠️ This is a front-end demo. No real payments are processed.

---

## 🛠️ Technologies Used

- [HTML5](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [Tailwind CSS](https://tailwindcss.com/) (via CDN)
- [Font Awesome 6](https://fontawesome.com/) (icons)
- [DummyJSON API](https://dummyjson.com/) (product data)
- Vanilla JavaScript (no frameworks)

---

## 📬 Contact

**GlowHer Store**  
📧 info@glowher.com  
📞 (123) 456-7890  
🕐 Sunday – Thursday: 9 AM – 6 PM  
📍 Cairo, Egypt

---

## 📄 License

© 2026 GlowHer. All rights reserved.
