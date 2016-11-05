#API for CS3219 Assigment 5

### API server is deployed at http://ec2-54-179-159-147.ap-southeast-1.compute.amazonaws.com:3000

### Get all team members (1a)
+ Parameters: owner, repo
+ Example API request: http://ec2-54-179-159-147.ap-southeast-1.compute.amazonaws.com:3000/api/contributors?owner=tungnk1993&repo=scrapy.
+ Sample response:
results: [
  {
    author_name: "pablohoffman",
    avatar_url: "https://avatars.githubusercontent.com/u/185212?v=3",
    commits: 1834,
    deletion: 127969,
    addition: 125610
  }
]

### Get all commits of an author (1b and 1c)
+ Parameters: owner, repo, author, start, end (start and end are ISO string date)
+ Example API request: http://ec2-54-179-159-147.ap-southeast-1.compute.amazonaws.com:3000/api/member/commits?owner=tungnk1993&repo=scrapy&author=pablohoffman&start=2011-04-14T16:00:49Z&end=2016-11-02T17:31:06.573Z
+ Sample response:
results: [
  {
    commit_message: "Merge pull request #1544 from rolando/conda-docs Added installation notes about using Conda for Windows.",
    commit_url: "https://api.github.com/repos/tungnk1993/scrapy/git/commits/eb4daa34a298923dbb492a5d8b20e27fb1c0030c",
    author_name: "pablohoffman",
    author_avatar_url: "https://avatars.githubusercontent.com/u/185212?v=3",
    commit_date: "2015-11-26T17:11:28Z"
  }
]

### Trigger lambda function to send notification emails
+ http://ec2-54-179-159-147.ap-southeast-1.compute.amazonaws.com:3000/api/notification/invoke?token=Ek2wwa6vCCJ1AbuPxtbC


### Get all changes of a file path (1d)
+ Parameters: owner, repo, path, from, to
+ Example API request: 
http://ec2-54-179-159-147.ap-southeast-1.compute.amazonaws.com:3000/api/file?owner=tungnk1993&repo=scrapy&path=docs%2Ftopics%2Fmedia-pipeline.rst&from=192&to=195

### Get all subscription
+ http://ec2-54-179-159-147.ap-southeast-1.compute.amazonaws.com:3000/api/subscription/all

### Create a subscription
+ Parameters: email, repo (email subscripts repo);
+ http://ec2-54-179-159-147.ap-southeast-1.compute.amazonaws.com:3000/api/subscription/create?email=thientran1707@gmail.com&repo=https://github.com/thientran1707/cs3219test

### Add repo to subscription for user
+ Parameters: email, repo (email subscripts repo);
+ http://ec2-54-179-159-147.ap-southeast-1.compute.amazonaws.com:3000/api/subscription/add?email=thientran1707@gmail.com&repo=https://github.com/thientran1707/cs3219test

### Get notification for user
+ Paramers: email.
+ http://ec2-54-179-159-147.ap-southeast-1.compute.amazonaws.com:3000/api/notification?email=thientran1707@gmail.com
