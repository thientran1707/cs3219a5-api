import request from 'request-promise';
import moment from 'moment';
import Promise from 'bluebird';
import config from '../config';
import { fetchContributors, fetchBranches, fetchCommitsForBranchAndAuthor } from './util';
const API_URL = 'https://api.github.com/repos/';

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

export function fetchMemberCommitHistory(owner, repo, author, start, end) {
  const options = {
    uri: API_URL + `${owner}\${repo}\commits?client_id=${config.github_client_id}&client_secret=${config.github_client_secret}`,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  };

  return fetchAllBranches(owner, repo, author, start, end)
    .then((branches) => {
      const promiseArray = branches.map((branch) => {
        return fetchCommitsFromBranch(owner, repo, branch, author, start, end);
      });

      return Promise.all(promiseArray);
    })
    .then((results) => {
      // merge them
      let commits = [];
      let hash = {}; // hash to avoid duplicate

      for (let result of results) {
        for (let commit of result) {
          const { commit_url } = commit;
          if (!hash[commit_url]) {
            hash[commit_url] = true;
            commits.push(commit);
          }
        }
      }

      // sort by date
      return commits.sort((first, second) => {
        return moment(second.commit_date) - moment(first.commit_date);
      });
    });
}

export function compareEfforts() {

}

export function fetchCommitHistoryWithCodeChunk() {

}

export function fetchTeamLinesOfCode() {

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

function fetchAllBranches(owner, repo) {
  return fetchBranches(owner, repo)
    .then((branches) => {
      return branches.map((branch) => {
        const { name } = branch;
        return name;
      });
    });
}

// get the number of commits of user, if not found, return -1
function findCommitCountForAuthor(owner, repo, author) {
  return fetchContributors(owner, repo)
    .then((contributors) => {
      let count = 100;
      for (let contributor of contributors) {
        if (contributor.author && contributor.author.login == author) {
          count = contributor.total;
          break;
        }
      }

      return count;
    });
}

function fetchCommitsFromBranch(owner, repo, branch, author, start, end) {
  /*findCommitCountForAuthor(owner, repo, author)
    .then((count) => {
      //console.log('Count is: ', count);
      const promiseArray = [];
      console.log('Start fetching...');
      for (let i = 1; i <= Math.ceil(count / 100); i++) {
        const promise = fetchCommitsForBranchAndAuthor(owner, repo, branch, author, start, end, i)
          .then((commitObjs) => {
            return commitObjs.map((commitObj) => {
              const { commit, author } = commitObj;
              const { message: commit_message, url: commit_url } = commit;
              const { login: author_name, avatar_url: author_avatar_url } = author;
              const commit_date = commit.author.date;

              return { commit_message, commit_url, author_name, author_avatar_url, commit_date };
            });
          });

        promiseArray.push(promise);
      }

      return Promise.all(promiseArray);
    })
    .then((results) => {
      // merge them
      let commits = [];
      let hash = {}; // hash to avoid duplicate

      for (let result of results) {
        for (let commit of result) {
          const { commit_url } = commit;
          if (!hash[commit_url]) {
            hash[commit_url] = true;
            commits.push(commit);
          }
        }
      }

      return commits;
    });*/

  return fetchCommitsForBranchAndAuthor(owner, repo, branch, author, start, end, 1)
    .then((commitObjs) => {
      return commitObjs.map((commitObj) => {
        const { commit, author } = commitObj;
        const { message: commit_message, url: commit_url } = commit;
        const { login: author_name, avatar_url: author_avatar_url } = author;
        const commit_date = commit.author.date;

        return {
          commit_message,
          commit_url,
          author_name,
          author_avatar_url,
          commit_date
        };
      });
    });
}
