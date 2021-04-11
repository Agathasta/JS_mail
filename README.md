# MAIL

## [CS50 Web Design Project 3](https://cs50.harvard.edu/web/2020/projects/3/mail/)

Design a front-end for an email client that makes API calls to send and receive emails.  

YouTube URL: <https://youtu.be/HRt4POzRGLE>  

TECHNOLOGIES USED  

* HTML
* CSS
* JAVASCRIPT
* PYTHON & DJANGO: part of the distribution code.
  - I created a superuser
  - I added the line <code>DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'</code> to <code>settings.py</code> to avoid warning due to newer Django version.

What I learned:  

* Git: branch off a part of the work, in this case the CSS. Merge it back in.
* CSS: implement the background layout on a grid. Make it responsive.
* JS: change the look of different elements depending on user's interaction.
* JS: make API calls ('GET', 'PUT' and 'POST') to fetch data.

ToDos:

* Delete mails, I get 'Bad request' as a response.
* Change the format of the original mail (color, font size, indentation)
