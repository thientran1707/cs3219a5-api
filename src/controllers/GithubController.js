'use strict';

import { fetchTeamContribution, fetchMemberCommitHistory, fetchFileChangeHistory, cloneGitRepo } from '../api/github';

class GithubController {
  retrieveContributor(req, res) {
    const { owner, repo } = req.query;
    if (!owner || !repo) {
      res.status(400).json({
        error: 'Owner and repo required'
      });

      return;
    }

    reply(res, fetchTeamContribution(owner, repo));
  }

  retrieveMemberCommitHistory(req, res) {
    const { owner, repo, author, start, end, page } = req.query;

    if (!owner || !repo || !author) {
      res.status(400).json({
        error: 'Owner, repo, author required'      
      });

      return;
    }

    reply(res, fetchMemberCommitHistory(owner, repo, author, start, end, page));
  }

  retrieveFileChangeHistory(req, res) {
    const { owner, repo, start, end, path } = req.query;

    if (!owner || !repo) {
      res.status(400).json({
        error: 'Owner, repo, author required'      
      });

      return;
    }

    reply(res, fetchFileChangeHistory(owner, repo, start, end, path));
  }

  retrieveActiveLines(req, res) {
    const { owner, repo } = req.query;

    cloneGitRepo(owner, repo).then(() => {
      res.status(200).json({
        message: 'Success'
      });
    })
    .catch((err) => {
      console.log('Error: ');
      console.log(err);
      res.status(500).json({
        error: err.message
      });
    });
  }
}

function reply(res, apiCall) {
  apiCall
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message
      });
    });
}

export default GithubController;
