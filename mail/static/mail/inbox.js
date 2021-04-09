document.addEventListener('DOMContentLoaded', () => {

  // Change background color of navbar buttons when clicked
  document.querySelectorAll('button').forEach(button => {
    button.onclick = (event) => {
      document.querySelectorAll('button').forEach(button => button.classList.remove('active'));
      event.target.classList.add('active');
    }
  });

  // Use buttons to toggle between views (after changing background color of button)
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

        // Create three different spans to show on a grid
        const correspondent = document.createElement('span');
        const subject = document.createElement('span');
        const timestamp = document.createElement('span');

        if (mailbox === 'sent') {
          if (emails[i].recipients.length > 1) {
            correspondent.innerHTML = `${emails[i].recipients}...`;
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
        correspondent.className = 'bold';
        timestamp.className = 'graytext';

        // Create the actual grid div, append the spans to it and append it to the DOM
        const mail = document.createElement('div');
        mail.classList.add('mail-list');
        mail.append(correspondent, subject, timestamp);

        // Display mail
        mail.addEventListener('click', () => select_email(emails[i]));

        document.querySelector('#emails-view').append(mail);
      }
    });
}

function select_email(email) {

  fetch(`/emails/${email.id}`)
    .then(response => response.json())
    .then(email => display_email(email));
}

function display_email(email) {

  // Show display view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#display-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Display email
  document.querySelector('#from').innerHTML = email.sender;
  document.querySelector('#to').innerHTML = email.recipients;
  document.querySelector('#subject').innerHTML = email.subject;
  document.querySelector('#timestamp').innerHTML = email.timestamp;
  document.querySelector('#body').innerHTML = email.body;
}


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
        document.querySelector('#sent').classList.add('active');
        document.querySelector('#compose').classList.remove('active');
      }
    });
  return false;
}
