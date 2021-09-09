console.log('Inside main.js');
var username = document.getElementById('username').nodeValue;
sessionStorage.setItem('currentUser', username);

var getUserName = sessionStorage.getItem('currentUser');
var usernameText = document.createElement('p');
usernameText.innerText = getUserName;
var div = document.getElementById('user');
div.appendChild(usernameText);



