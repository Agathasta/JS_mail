document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views (after changing background color of button)
  document.querySelector('#inbox').addEventListener('click', (event) => {
    document.querySelectorAll('button').forEach(button => button.classList.remove('active'));
    event.target.classList.add('active');
    load_mailbox('inbox');
  });
  document.querySelector('#sent').addEventListener('click', (event) => {
    document.querySelectorAll('button').forEach(button => button.classList.remove('active'));
    event.target.classList.add('active');
    load_mailbox('sent');
  });
  document.querySelector('#archived').addEventListener('click', (event) => {
    document.querySelectorAll('button').forEach(button => button.classList.remove('active'));
    event.target.classList.add('active');
    load_mailbox('archive');
  });
  document.querySelector('#compose').addEventListener('click', (event) => {
    document.querySelectorAll('button').forEach(button => button.classList.remove('active'));
    event.target.classList.add('active');
    compose_email();
  });

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h2>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h2>`;
}