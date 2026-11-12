# BAZEX — standalone website

A normal static website (HTML + CSS + JavaScript). No YouCan, no server, no build step.

## Open it
Double-click `index.html`, or upload the whole folder to any host (Netlify, Vercel, GitHub Pages, cPanel…).

## Edit it — everything is in `js/content.js`
| To change…                                   | Edit…                         |
|----------------------------------------------|-------------------------------|
| Logo (replace with your own SVG/PNG)         | `config.logo` (file in `img/`) |
| Phone, email, city, social links             | `config`                      |
| WhatsApp number that receives orders         | `config.whatsapp`             |
| Delivery fee, free-delivery amount, coupons  | `config.shipping`, `freeShippingFrom`, `coupons` |
| Picture sizes / products per row             | `config.images`               |
| Home page texts, pictures, buttons           | `home`                        |
| Products (name, price, old price, stock, pictures, colours) | `products`     |
| French and English interface texts           | `ui.fr`, `ui.en`              |

Add your pictures to the `img/` folder and write their path, e.g. `"img/my-bag.jpg"`.
To add a product, copy one block in `products`, give it a new unique `id`, and (to show it on the home page) add the id to `home.featured.productIds`.

## How orders work
There is no server. At checkout the customer fills in name, phone, city and address; the order opens in WhatsApp
(pre-filled message to your number) and is also kept in the browser. To also receive orders / contact messages / newsletter
sign-ups by e-mail, create a form on formspree.io and paste its URL in `config.formEndpoint`.

## Languages
French and English. The visitor switches with the globe button in the header; the choice is remembered.
Links like `index.html?lang=en` open directly in English.
