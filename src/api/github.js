import request from 'request-promise';
import moment from 'moment';
import Promise from 'bluebird';
import Git from 'nodegit';
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

export function retrieveNotificationForSubscription(email, repos, start) {
  const end = new Date().toISOString();

  const promiseArray = [];
  for (let url of repos) {
    const { owner, repo } = getOwnerAndRepo(url);
    promiseArray.push(fetchCommitsMultiple(owner, repo, null, start, end, null, 1));
  }

  return Promise.all(promiseArray)
  .then((results) => {
    return results.map((result, index) => {
      return {
        repo: repos[index],
        commits: result
      };
    });
  })
  .then((commitObjs) => {
    const htmlString = createHtmlMessage(commitObjs, start);
    return {
      email: email,
      commitObjs: commitObjs,
      html: htmlString,
      last_visit: start
    };
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

function createHtmlMessage(commitObjs, last_visit) {
  let htmlString = '<h1>Updates from GitGuard for your subscription</h1>';

  let count = 0;
  for (let commitObj of commitObjs) {
    if (commitObj.commits.length != 0) {
      count++;
    }
  }

  htmlString += "<h2>Your last visit to GitGuard: " + last_visit + "</h2>";
  htmlString += "<h2>You subscribed to follow " + commitObjs.length + " Github repos, " + count + " of them have new commits from your last visit.</h2>";
  
  for (let commitObj of commitObjs) {
    const { commits, repo } = commitObj;
    if (commits.length == 0) {
      continue;
    }

    htmlString += "<h2>New commits of repo " + repo + ":</h2>";
    htmlString += "<ul>";

    for (let commit of commits) {
      const { commit_message } = commit;
      htmlString += "<li>" + commit_message + "</li>";
    }

    htmlString += "</ul>";
  }

  return htmlString;
}

function getOwnerAndRepo(url) {
  const tokenizer = url.split('/');
  const length = tokenizer.length;

  if (length < 2) {
    return;
  }

  return {
    owner: tokenizer[length - 2],
    repo: tokenizer[length - 1]
  };
}
