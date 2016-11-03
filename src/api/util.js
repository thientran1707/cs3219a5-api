import config from '../config';
import request from 'request-promise';
const API_URL = 'https://api.github.com/repos/';

export function fetchContributors(owner, repo) {
  const options = {
    uri: API_URL + `${owner}/${repo}/stats/contributors`,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    qs: {
      client_id: config.github_client_id,
      client_secret: config.github_client_secret
    },
    json: true
  };

  return request(options);
}

export function fetchCommits(owner, repo, author, start, end, path, page) {
  var nullable = {};
  if (author) Object.assign(nullable, { author: author });
  if (start) Object.assign(nullable, { since: start });
  if (end) Object.assign(nullable, { until: end });
  if (page) Object.assign(nullable, { page: page });
  if (path) Object.assign(nullable, { path: path });
  const qs = Object.assign(nullable, {
    per_page: 100,
    branch: 'master',
    client_id: config.github_client_id,
    client_secret: config.github_client_secret
  });
  const options = {
    uri: API_URL + `${owner}/${repo}/commits`,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    qs: qs,
    json: true
  };

  return request(options);
}

export function fetchCommitBySha(owner, repo, sha) {
  const qs = {
    per_page: 100,
    branch: 'master',
    client_id: config.github_client_id,
    client_secret: config.github_client_secret
  };
  const options = {
    uri: API_URL + `${owner}/${repo}/commits/${sha}`,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    qs: qs,
    json: true
  };

  return request(options);
}
