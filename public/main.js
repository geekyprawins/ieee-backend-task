
document.getElementById("submit").addEventListener("click", catchUser);

async function catchUser (){
   nameUser = document.getElementById("username").value;
   //console.log (nameUser);
   //alert(nameUser);
   localStorage.setItem('name', nameUser);
}
