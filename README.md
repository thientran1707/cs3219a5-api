# cs3219a5

#API
1.(a) 
for all team members,
on get: param: member, number of commits, insertions, deletion, % of changes
(b) + (d)
on get: param: list of members, list of files
on post: return commit history of the selected member and file. When member is all , return for all members; when files is all, return for all files.
(c)
on get: param: list of members
(e)
on get: number of lines of code in project by each member
(f) (extra)
on get: total Number of Commits Per Hour Each Day

2.on subscribe page,
on post: subscribe to notification service.

3. add s3

4. implement lambda function

1a)
Sample API

1b)
Sample API
http://localhost:3000/api/member/commits?owner=tungnk1993&repo=scrapy&author=pablohoffman&start=2011-04-14T16:00:49Z&end=2016-11-02T17:31:06.573Z