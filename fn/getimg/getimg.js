const { Octokit } = require("@octokit/core");

const gtoken = process.env.G_TOKEN;
// github personal access token - https://github.com/settings/tokens/new?scopes=repo

const octokit = new Octokit({ auth: gtoken });

const handler = async (event) => {
  try {
    // extract SVG info from the image
    const fileInfo = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner: "ishqdehlvi",
        repo: "ishqdehlvi",
        path: "music-badge.svg",
      }
    );

    return {
      statusCode: 200,
      body: fileInfo.data.content,
      headers: { "content-type": "image/svg+xml" },
      isBase64Encoded: true,
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
