#!/Users/janowork/.nvm/versions/node/v20.8.0/bin/node
const fs = require('fs');
const yaml = require('js-yaml');

const projectRoot = `/Users/janowork/Sites/janodev-astro`;
const typeMap = {
  'blog': 'blog',
  'media': 'mediaposts',
}

const filePath = `${projectRoot}/${process.argv[2]}`; // Assuming the file path is passed as the first command line argument

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  // Parse the frontmatter
  const frontmatterRegex = /^---\n([\s\S]+?)\n---/;
  const match = data.match(frontmatterRegex);
  if (match) {
    let frontmatter = match[1];
    // Check if the frontmatter has the "draft" property
    try {
      const frontmatterObj = yaml.load(frontmatter);

      // Remove null properties from frontmatterObj
      Object.keys(frontmatterObj).forEach((key) => {
        if (frontmatterObj[key] === null) {
          delete frontmatterObj[key];
        }
      });

      if (frontmatterObj.draft && frontmatterObj.draft === 'Published') {
        frontmatterObj.draft = false;
      } else {
        frontmatterObj.draft = true;
      }

      
      if (!frontmatterObj.type || ! Object.prototype.hasOwnProperty.call(typeMap, frontmatterObj.type)) {
        frontmatterObj.type = 'blog';
      }

      if (frontmatterObj.tags) {
        frontmatterObj.tags = frontmatterObj.tags.split(',').map((tag) => tag.trim());
      }

      const updatedFrontmatter = yaml.dump(frontmatterObj);
      // Replace the frontmatter in the original data with the updated frontmatter
      const updatedData = data.replace(frontmatterRegex, `---\n${updatedFrontmatter}\n---`);

      if ( ! frontmatterObj.slug ) {
        frontmatterObj.slug = frontmatterObj.title.toLowerCase().replace(/ /g, '-').replace(/[^a-zA-Z0-9-]/g, '').replace(/-{2,}/g, '-');
      }

      const outputPath = `${projectRoot}/src/content/${typeMap[frontmatterObj.type]}/${frontmatterObj.slug}.md`;

      fs.writeFile(outputPath, updatedData, 'utf8', (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(`File ${outputPath} has been created.`);
      });
    } catch (e) {
      console.error('Error parsing frontmatter:', e);
    }

  }
});