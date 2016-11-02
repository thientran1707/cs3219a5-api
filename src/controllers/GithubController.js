'use strict';

import { fetchTeamContribution, fetchMemberCommitHistory } from '../api/github';

class GithubController {

  retrieveContributor(req, res) {
    const { owner, repo } = req.query;
    if (!owner || !repo) {
      res.status(400).json({
        error: 'Owner and repo required'
      });

      return;
    }

    fetchTeamContribution(owner, repo)
      .then((results) => {
        res.status(200).json({
          results: results
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err.message
        });
      });
  }

  retrieveMemberCommitHistory(req, res) {
    const { owner, repo, author, start, end } = req.query;

    if (!owner ||!repo || !author || !start || !end) {
      res.status(400).json({
        error: 'Owner, repo, author, start and end time required'      
      });

      return;
    }

    fetchMemberCommitHistory(owner, repo, author, start, end)
      .then((commits) => {
        res.status(200).json({
          results: commits
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err.message
        });
      });
  }

}

export default GithubController;
