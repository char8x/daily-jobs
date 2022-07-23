import { load } from 'https://esm.sh/cheerio@1.0.0-rc.12'

const html = await fetch('https://www.alfredapp.com/workflows/').then(res => res.text());

const $ = load(html);
const pageText = $('#workflowspage > section:nth-child(4) > div > div > p:nth-child(1)').text().trim()

if (pageText !== 'This page is currently being overhauled with a whole load of new amazing Workflows built by us and our community.') {
  console.log('Check it out!')
} else {
  console.log('This page is currently being overhauled with a whole load of new amazing Workflows built by us and our community.')
}
