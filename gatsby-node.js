exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /auth0-js/,
            use: loaders.null(),
          },
        ],
      },
    });
  }
};


exports.createPages = ({ graphql, actions }) => {
  const { createRedirect } = actions;
  createRedirect({ fromPath: '/invite-a-colleague.html', toPath: '/invite-a-colleague' });
  createRedirect({
    fromPath: '/welcome/*',
    toPath: '/welcome',
    statusCode: 200,
  });
}

// Re-routing some url overriding gatsby pages way
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions
  if (page.path.match(/^\/welcome/)) {
    page.matchPath = "/welcome/*"
    // Update the page.
    createPage(page)
  }
}
