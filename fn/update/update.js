const fs = require('fs').promises;
const { Octokit } = require('@octokit/core');

const token = process.env.token;
const gtoken = process.env.G_TOKEN;
// github personal access token - https://github.com/settings/tokens/new?scopes=repo

const octokit = new Octokit({ auth: gtoken });

const handler = async (event) => {
  if (event.headers.token !== token) {
    return {
      statusCode: 403,
      body: 'Unauthorized',
    };
  }

  try {
    let { song, state } = event.queryStringParameters;
    if (state !== 'playing') {
      song = 'Nothing ^_^';
    }

    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="547" height="59" viewBox="0 0 547 59" fill="none">
  <g filter="url(#filter0_i)">
    <rect width="547" height="59" rx="13" fill="#FF0000" />
  </g>
  <path d="M0 13C0 5.8203 5.8203 0 13 0H83V59H13C5.8203 59 0 53.1797 0 46V13Z" fill="#454343" />
  <path d="M40.5 6C25.302 6 13 18.0119 13 32.8571V37.8929C13 38.5163 13.1778 39.1275 13.5134 39.6578C13.849 40.1882 14.3292 40.6168 14.9002 40.8956L16.4452 41.65C16.6613 47.9541 21.9612 53 28.4688 53H31.0469C32.4708 53 33.625 51.8727 33.625 50.4821V32.0179C33.625 30.6273 32.4708 29.5 31.0469 29.5H28.4688C25.1019 29.5 22.0588 30.8511 19.875 33.0278V32.8571C19.875 21.7504 29.1274 12.7143 40.5 12.7143C51.8726 12.7143 61.125 21.7504 61.125 32.8571V33.0278C58.9412 30.8511 55.8981 29.5 52.5312 29.5H49.9531C48.5292 29.5 47.375 30.6273 47.375 32.0179V50.4821C47.375 51.8727 48.5292 53 49.9531 53H52.5312C59.0388 53 64.3387 47.954 64.5548 41.65L66.0997 40.8956C66.6707 40.6168 67.1509 40.1882 67.4866 39.6578C67.8222 39.1275 68 38.5163 68 37.8929V32.8571C68 18.0145 55.7006 6 40.5 6Z" fill="white" />
  <text fill="white" xml:space="normal" style="white-space: normal" font-family="sans-serif" font-size="40" font-weight="600" letter-spacing="0em">
    <tspan x="60%" y="42.5176" text-anchor="middle">
  ${song.slice(0, 20)}
  </tspan>
  </text>
  <defs>
    <filter id="filter0_i" x="0" y="0" width="547" height="59" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix" />
      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
      <feOffset />
      <feGaussianBlur stdDeviation="4" />
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
      <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
    </filter>
  </defs>
</svg>
    `;

    const buff = Buffer.from(svg, 'utf-8');

    const fileInfo = await octokit.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        owner: 'ishqdehlvi',
        repo: 'ishqdehlvi',
        path: 'music-badge.svg',
      }
    );

    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'ishqdehlvi',
      repo: 'isqhdehlvi',
      path: 'music-badge.svg',
      message: `Updated to ${song}`,
      sha: fileInfo.data.sha,
      content: buff.toString('base64'),
    });

    return {
      statusCode: 200,
      body: JSON.stringify('Updated'),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
