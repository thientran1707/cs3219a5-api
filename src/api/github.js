import request from 'request-promise';
import moment from 'moment';
import Promise from 'bluebird';
import config from '../config';

const API_URL = 'https://api.github.com/repos/';

export function fetchTeamContribution(owner, repo) {
  const options = {
    uri: API_URL + `${owner}/${repo}/stats/contributors?client_id=${config.github_client_id}&client_secret=${config.github_client_secret}`,
    uri: API_URL + owner + '/' + repo + '/stats/contributors?' + `client_id`,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  };

  return request(options)
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

// start and end should be Javascript timestamp
export function fetchMemberCommitHistory(owner, repo, author, start, end) {
  const options = {
    uri: API_URL + `${owner}\${repo}\commits?client_id=${config.github_client_id}&client_secret=${config.github_client_secret}`,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  };

  return fetchAllBranches(owner, repo)
    .then((branches) => {
      console.log('Nubmer of branches: ', branches.length);

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

      console.log('Size is: ', commits.length);
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
  const options = {
    uri: API_URL + `${owner}/${repo}/branches?client_id=${config.github_client_id}&client_secret=${config.github_client_secret}`,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  };

  return request(options)
    .then((branches) => {
      return branches.map((branch) => {
        const { name } = branch;
        return name;
      });
    });
}

function fetchAllCommitsFromBranch(owner, repo, branch, author, start, end) {
  const result = [];
  let page = 0;
  // default per_page is 30
  while (true) {
    
  }

}

function fetchCommitsFromBranch(owner, repo, branch, author, start, end) {
  const options = {
    uri: API_URL + `${owner}/${repo}/commits?sha=${branch}&author=${author}&since=${start}&until=${end}&per_page=100&client_id=${config.github_client_id}&client_secret=${config.github_client_secret}`,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  };

  return request(options)
    .then((commitObjs) => {
      console.log('Commit objs size: ', commitObjs.length);
      //console.log(commitObjs);
      // commit message, url
      // committer_name, committer_avatar_url, commit_date
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
