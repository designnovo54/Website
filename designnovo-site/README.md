# Design Novo — Premium Agency Website

A self-contained, responsive static website for Design Novo. It uses the supplied Design Novo logo and a CSS-built 3D-style hoodie character that moves through the page as the user scrolls.

## Included

- Premium blue / black visual system
- Responsive mobile, tablet and desktop layouts
- Full-body Design Novo character image supplied for the hero experience
- Cinematic hero zoom-in when the site opens
- Character moves from center to left/right through the page as you scroll
- Animated wave/HEY moment during the early scroll
- Animated CTA/click gesture near the partner/contact area
- Blue aura, floor glow and depth effects around the character
- Services:
  - 3D Product Animation
  - Social Media Marketing
  - Website Development
  - Video Editing
  - AI Video Creation
  - Product Shooting
  - Influencer Marketing
  - Custom / other creative services
- About, Why Novo, Partner Up and Contact sections
- Hover micro-interactions
- Reduced-motion accessibility support
- No npm dependencies — pure HTML/CSS/JS
- Optimized for drag-and-drop deployment

## Run locally

Double-click `index.html` or serve the folder with any static server.

## Deploy to Vercel

Vercel supports dragging a folder or `.zip` into Vercel Drop. The project contains `index.html` at the root, so it can be served as a static site.

1. Open https://vercel.com/drop
2. Drag the `designnovo-site.zip` file into the page.
3. Choose a project name and deploy.
4. Vercel will provide a public `.vercel.app` URL.

## Before production

Replace the demo contact email and connect the contact form to Formspree, Resend, a CRM, or your preferred backend. The current form intentionally has no external submission dependency.

## Brand

The uploaded Design Novo logo has been converted to a transparent-background asset for use on the dark site.
The supplied full-body character image was also cut out from its original background and included as `assets/designnovo-character.png`.
The CSS/JS choreography is designed so the character begins large in the center of the hero copy, then travels around the page, waves, and finishes near the CTA/contact flow with a click cue.
