if(localStorage.getItem("name")){
    window.location.href = "index.html";
    exit()
} else {
    let form = document.createElement('form');
    form.innerHTML = `<input id="name" placeholder="PokémonHunter64"><input type="submit" value="Ready!">`;
    document.body.append(form);
    form.addEventListener('submit', function saveName(event){
        event.preventDefault()
        let nameValue = document.getElementById("name").value;
        console.log(nameValue)
        if(!nameValue == " ") {
          console.log(nameValue)
          localStorage.setItem("name", nameValue)
          window.location.href = "index.html";
        }
      })
}