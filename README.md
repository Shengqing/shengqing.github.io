# Personal research website Template

A minimal black-and-white personal site for a graduate student or researcher. The research page is the default view, with a documentation-style sidebar and a separate About view. It is plain HTML, CSS, and JavaScript, so GitHub Pages can publish it without a build step.

## Update your content

Most edits happen in [`site-data.js`](site-data.js):

- name, affiliation, research keywords, location, and contact details
- research questions and interests
- projects and publications
- experience and education
- social links

Add your CV at `assets/cv.pdf`, then change the `cv` link in `site-data.js` from `#` to `assets/cv.pdf`.

## Preview locally

Opening `index.html` directly works. For a more accurate GitHub Pages preview, run:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
