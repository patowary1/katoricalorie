const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'as', 'index.html');
let content = fs.readFileSync(filePath, 'utf-8');

content = content.replace(
  '<meta property="og:title" content="KatoriCalorie | Premium Regional & National Food Nutrition Platform">',
  '<meta property="og:title" content="KatoriCalorie | অসমীয়া আৰু ভাৰতীয় খাদ্যৰ পুষ্টি আৰু কেলৰি নিৰূপণ">'
);

content = content.replace(
  '<meta property="og:description" content="Compute your BMR with the Mifflin-St Jeor formula and dynamically track calories for traditional Indian and Northeast staples like Masor Tenga, Omita Khar, and Til Pitha.">',
  '<meta property="og:description" content="অসমীয়া আৰু ভাৰতীয় থালিত খোৱা ভাত, ৰুটী, মাছৰ টেঙা আদি খাদ্যৰ কেলৰি নিৰূপণ কৰক। Mifflin-St Jeor সূত্ৰ ব্যৱহাৰ কৰি আপোনাৰ দৈনিক BMR হিচাপ কৰক।">'
);

content = content.replace(
  '<meta name="twitter:url" content="https://www.katoricalorie.in/">',
  '<meta name="twitter:url" content="https://www.katoricalorie.in/as">'
);

content = content.replace(
  '<meta name="twitter:title" content="KatoriCalorie | Premium Regional & National Food Nutrition Platform">',
  '<meta name="twitter:title" content="KatoriCalorie | অসমীয়া আৰু ভাৰতীয় খাদ্যৰ পুষ্টি আৰু কেলৰি নিৰূপণ">'
);

content = content.replace(
  '<meta name="twitter:description" content="Compute your BMR with the Mifflin-St Jeor formula and dynamically track calories for traditional Indian and Northeast staples like Masor Tenga, Omita Khar, and Til Pitha.">',
  '<meta name="twitter:description" content="অসমীয়া আৰু ভাৰতীয় থালিত খোৱা ভাত, ৰুটী, মাছৰ টেঙা আদি খাদ্যৰ কেলৰি নিৰূপণ কৰক। Mifflin-St Jeor সূত্ৰ ব্যৱহাৰ কৰি আপোনাৰ দৈনিক BMR হিচাপ কৰক।">'
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully updated as/index.html OG and Twitter tags!');
