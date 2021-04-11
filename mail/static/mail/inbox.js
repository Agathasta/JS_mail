document.addEventListener('DOMContentLoaded', () => {

  // Change background color of navbar buttons when clicked
  document.querySelectorAll('.nav-btn').forEach(button => {
    button.onclick = (event) => {
      document.querySelectorAll('.nav-btn').forEach(button => button.classList.remove('active'));
      event.target.classList.add('active');
    }
  });

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', () => compose_email());

  // By default, load the inbox
  load_mailbox('inbox');
  document.querySelector('#inbox').classList.add('active');

  // Send an email
  document.querySelector('#compose-form').onsubmit = () => send_email();
});


// EMAILS VIEW
function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#display-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h2>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h2>`;

  // Display email list
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      for (let i = 0; i < emails.length; i++) {

        // Create three different spans to show on the grid
        const correspondent = document.createElement('span');
        const subject = document.createElement('span');
        const timestamp = document.createElement('span');

        if (mailbox === 'sent') {
          if (emails[i].recipients.length > 1) {
            correspondent.innerHTML = `${emails[i].recipients[0]}...`;
          }
          else {
            correspondent.innerHTML = emails[i].recipients;
          }
        }
        else {
          if ((mailbox === 'inbox' && emails[i].archived) || (mailbox === 'archived' && !emails[i].archived)) {
            continue;
          }
          correspondent.innerHTML = emails[i].sender;
        }
        subject.innerHTML = emails[i].subject;
        timestamp.innerHTML = emails[i].timestamp;
        timestamp.className = 'timestamp';

        // Create the actual grid div, append the spans to it and append it to the DOM
        const mail = document.createElement('div');
        mail.classList.add('mail-list');
        if (emails[i].read) {
          mail.classList.add('read');
        }
        else {
          mail.classList.remove('read');
          mail.classList.add('bold');
        }
        mail.append(correspondent, subject, timestamp);

        // Display mail in view
        mail.addEventListener('click', () => select_email(emails[i], mailbox));
        document.querySelector('#emails-view').append(mail);
      }
    });
}

// Select mail to display and automatically mark it as read
function select_email(email, mailbox) {

  fetch(`/emails/${email.id}`)
    .then(response => response.json())
    .then(email => display_email(email, mailbox));

  fetch(`/emails/${email.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  })
}

// DISPLAY VIEW
function display_email(email, mailbox) {

  // Show display view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#display-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Display email
  document.querySelector('#from').innerHTML = email.sender;
  document.querySelector('#to').innerHTML = email.recipients.join(', ');
  document.querySelector('#subject').innerHTML = email.subject;
  document.querySelector('#timestamp').innerHTML = email.timestamp;
  document.querySelector('#body').innerText = email.body;
  if (mailbox === 'sent') {
    document.querySelector('#mail-btns').style.display = 'none';
  }
  else {
    document.querySelector('#mail-btns').style.display = 'initial';
  }

  // Mark an not read or archive emails
  document.querySelector('#not-read').onclick = () => not_read_email(email, mailbox);
  document.querySelector('#archive').onclick = () => archived_email(email, mailbox);

  // Reply to mail
  document.querySelector('#reply').onclick = () => reply_email(email);
}

function not_read_email(email, mailbox) {
  fetch(`/emails/${email.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: false
    })
  })
    .then(() => {
      if (mailbox === 'inbox') {
        load_mailbox('inbox')
      }
      else {
        load_mailbox('archive')
      }
    })
}

function archived_email(email) {
  if (email.archived === false) {
    fetch(`/emails/${email.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        archived: true
      })
    })
      .then(() => load_mailbox('inbox'))
  }
  else {
    fetch(`/emails/${email.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        archived: false
      })
    })
      .then(() => load_mailbox('inbox'))
  }
  document.querySelector('#inbox').classList.add('active');
  document.querySelector('#archived').classList.remove('active');
}

function reply_email(email) {
  compose_email()

  // Fill in composition fields
  document.querySelector('#compose-recipients').value = email.sender;
  if (email.subject.startsWith('Re:')) {
    document.querySelector('#compose-subject').value = email.subject;
  }
  else {
    document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
  }
  document.querySelector('#compose-body').value = `\n\n\nOn ${email.timestamp} ${email.sender} wrote: \n\n${email.body} \n\n`;
  // Set autofocus on recipient input field
  document.querySelector('#compose-body').focus();
  document.querySelector('#compose-body').setSelectionRange(0, 0);
}

// COMPOSE VIEW
function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#display-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  // Set autofocus on recipient input field
  document.querySelector('#compose-recipients').focus()
}


function send_email() {

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: document.querySelector('#compose-recipients').value,
      subject: document.querySelector('#compose-subject').value,
      body: document.querySelector('#compose-body').value
    })
  })
    .then(response => response.json())
    .then(result => {

      if (result.error) {
        document.querySelector('#send-mail').innerHTML = result.error;
        document.querySelector('#send-mail').classList.add('message');
      }
      else {
        load_mailbox('sent');
        document.querySelectorAll('.nav-btn').forEach(button => button.classList.remove('active'));
        document.querySelector('#sent').classList.add('active');
      }
    });
  return false;
}
