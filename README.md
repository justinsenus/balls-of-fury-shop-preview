# Balls of Fury Ball Pythons

A responsive static site preview with a home page, social sections and a separate snake shop.

## Preview locally

Open the project folder in a terminal and run:

    python3 -m http.server 8080

Then visit http://localhost:8080.

## Add current listings

The inventory starts empty so the site does not show made-up snakes or prices. Add verified listings to assets/catalog.js. Put the matching listing photos in assets/listings/ and use only the white-background photos requested for the shop.

Each listing can include:

- id: a unique short identifier
- name: the listing name
- morphs: an array of genetics or morph names
- sex: Female, Male, or another accurate value
- price: a number in USD
- status: available, hold, or sold
- photo: path to the photo under assets/listings/
- description: short, verified listing detail
- featured: true or false

The shop displays each photo inside a rounded white panel so its background stays white against the dark teal site. Search, availability, morph, sex and sort controls work from this inventory file.

## Contact and checkout

The listing buttons link to the supplied Instagram profile so buyers can ask about an animal. This preview does not take payments or create orders. A payment provider and order flow can be connected when the breeder is ready to accept checkout on the site.

## Social links

The home page links to the supplied Instagram, YouTube and Facebook profiles. YouTube's uploads playlist and Facebook's page feed are embedded when those platforms permit embedded content; the direct profile links remain available on the cards.
