# Balls of Fury Ball Pythons

A responsive static site preview with a home page, social sections and a separate snake shop.

The preview shop contains 24 listings transcribed from the MorphMarket screenshot supplied for this project. Their pictures are crops from the screenshot, so they are useful for review but smaller than the original listing photos. Replace them with the full-resolution originals before launch, and confirm each animal's name, sex, price and availability with the breeder.

## Preview locally

Open the project folder in a terminal and run:

    python3 -m http.server 8080

Then visit http://localhost:8080.

## Update listings

Edit `assets/catalog.js` to update listings. Put each matching photo in `assets/listings/`; the design supports both clean product photos and natural enclosure or hand-held backgrounds. Product image panels are rounded and sized to crop consistently with the dark teal storefront.

Each listing can include:

- `id`: a unique short identifier
- `name`: the listing name
- `morphs`: an array of genetics or morph names
- `sex`: Female, Male, or another accurate value
- `price`: a number in USD
- `priceLabel`: optional display text for an auction or other non-fixed price
- `status`: available, hold, or sold
- `photo`: path to the listing image under `assets/listings/`
- `description`: short, verified listing detail
- `featured`: true or false

Search, availability, morph, sex and sort controls use this inventory file.

## Contact and checkout

Listing buttons link to the supplied Instagram profile so buyers can ask about an animal. This preview does not take payments or create orders. Connect a payment provider and order flow when the breeder is ready to accept checkout directly on the site.

## Social links

The home page links to the supplied Instagram, YouTube and Facebook profiles. The YouTube uploads playlist is embedded; Instagram uses a supplied profile-grid screenshot and Facebook uses a direct-link card. The profile links remain available on each card.
