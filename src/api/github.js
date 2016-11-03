import request from 'request-promise';
import moment from 'moment';
import Promise from 'bluebird';
import config from '../config';
import { fetchContributors, fetchCommits, fetchCommitBySha } from './util';
const API_URL = 'https://api.github.com/repos/';
const ALL_COMMITS_QUERY_RATE = 10;

export function fetchTeamContribution(owner, repo) {
  return fetchContributors(owner, repo)
    .then((contributors) => {
      return contributors.map((contributor) => {
        const { total: commits, weeks } = contributor;
        const { deletion, addition } = processWeekData(weeks);
        const { login: author_name, avatar_url } = contributor.author;

        return { author_name, avatar_url, commits, deletion, addition };
      });
    })
    .then((results) => {
      return results.sort((first, second) => {
        return second.commits - first.commits;
      });
    });
}

export function fetchMemberCommitHistory(owner, repo, author, start, end, page) {
  if (page) {
    return fetchCommitsSingle(owner, repo, author, start, end, null, page);
  } else {
    return fetchCommitsMultiple(owner, repo, author, start, end, null, 1);
  }
}

export function fetchFileChangeHistory(owner, repo, start, end, path) {
  return fetchCommitsMultiple(owner, repo, null, start, end, path, 1)
    .then(response => {
      const promiseList = response.map((entry) => {
        return fetchCommitBySha(owner, repo, entry.sha);
      });
      return Promise.all(promiseList);
    })
    .then(commitList => {
      return commitList.map(commit => commit.files);
    })
    .then(fileArrays => {
      return [].concat.apply([], fileArrays).filter((file) => file.filename == path).map((file) => {
        const { sha, patch } = file;
        return { sha, patch };
      });
    });
}

/**
 * Helper functions
 */
function processWeekData(weeks) {
  let addition = 0, deletion = 0;
  for (let week of weeks) {
    const { a, d } = week;
    addition += a;
    deletion += d;
  }
  return { addition, deletion };
}

function fetchCommitsMultiple(owner, repo, author, start, end, path, page) {
  const promiseList = Array(ALL_COMMITS_QUERY_RATE).fill().map((_, step) => {
    return fetchCommitsSingle(owner, repo, author, start, end, path, page + step);
  });
  return Promise.all(promiseList)
    .then((pages) => {
      const aggregate = [].concat.apply([], pages);
      if (pages[ALL_COMMITS_QUERY_RATE - 1].length == 0) {
        return aggregate;
      } else {
        return fetchCommitsMultiple(owner, repo, author, start, end, path, page + ALL_COMMITS_QUERY_RATE)
          .then((nextBatch) => {
            return aggregate.concat(nextBatch);
          });
      }
    });
}

function fetchCommitsSingle(owner, repo, author, start, end, path, page) {
  return fetchCommits(owner, repo, author, start, end, path, page)
    .then((response) => {
      return response.map((commitObj) => {
        const { commit, author, sha } = commitObj;
        const { message: commit_message, url: commit_url } = commit;
        const { login: author_name, avatar_url: author_avatar_url } = author;
        const commit_date = commit.author.date;
        return {
          sha,
          commit_message,
          commit_url,
          author_name,
          author_avatar_url,
          commit_date,
        };
      });
    });
}
