'use strict';

import { fetchTeamContribution, fetchMemberCommitHistory, fetchFileChangeHistory } from '../api/github';
import SubscriptionController from './SubscriptionController';
const Subscription = new SubscriptionController();

class GithubController {
  retrieveContributor(req, res) {
    const { owner, repo, email } = req.query;
    if (email) {
      Subscription.updateVisitTime(email); 
    }

    if (!owner || !repo) {
      res.status(400).json({
        error: 'Owner and repo required'
      });

      return;
    }

    reply(res, fetchTeamContribution(owner, repo));
  }

  retrieveMemberCommitHistory(req, res) {
    const { owner, repo, author, start, end, page, email, path } = req.query;
    if (email) {
      Subscription.updateVisitTime(email); 
    }

    if (!owner || !repo || !author) {
      res.status(400).json({
        error: 'Owner, repo, author required'      
      });

      return;
    }

    reply(res, fetchMemberCommitHistory(owner, repo, author, start, end, path, page));
  }

  retrieveFileChangeHistory(req, res) {
    const { owner, repo, from, to, path, email } = req.query;

    if (email) {
      Subscription.updateVisitTime(email); 
    }

    if (!owner || !repo) {
      res.status(400).json({
        error: 'Owner, repo, author required'      
      });

      return;
    }

    reply(res, fetchFileChangeHistory(owner, repo, from, to, path));
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
