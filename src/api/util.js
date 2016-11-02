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

export function fetchBranches(owner, repo) {
  const options = {
    uri: API_URL + `${owner}/${repo}/branches`,
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

export function fetchCommitsForBranchAndAuthor(owner, repo, branch, author, start, end, page) {
  const options = {
    uri: API_URL + `${owner}/${repo}/commits`,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    qs: {
      branch: branch,
      author: author,
      since: start,
      until: end,
      per_page: 100,
      page: page,
      client_id: config.github_client_id,
      client_secret: config.github_client_secret
    },
    json: true
  };

  return request(options);
}