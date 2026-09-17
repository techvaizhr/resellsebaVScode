# Product gallery video integration

## What will change
- Add a shared product media gallery that shows images and video in the same large preview area.
- Put the video thumbnail at the end of the image thumbnails; clicking it opens the playable video in the main preview.
- Keep uploaded-video download and YouTube link-copy controls inside the video preview.
- Support normal YouTube videos, Shorts/Reels-style vertical videos, and uploaded video files responsively.

## Where it will apply
- Master/public catalog product details
- Admin product details
- Reseller catalog product details
- Supplier product details
- Reseller storefront product page

## Technical details
- Reuse the existing video URL parsing and player behavior in one shared gallery component.
- Preserve each screen's existing image tools, branding, sizing, and modal/store styling.
- Reset the selected media when a different product opens, and show the thumbnail row whenever there is more than one media item.
- Verify desktop and mobile rendering plus TypeScript checks.
