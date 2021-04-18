if(!localStorage.getItem("name")){
    window.location.href = "login.html";
} else {


    const list = document.getElementById("list")
    const greeting = document.getElementById("greeting")
    let username = localStorage.getItem("name")
    greeting.innerHTML = `${username}'s Gallery`

    for (let i = 1; i < localStorage.length; i++){
        let drawing = localStorage.getItem(localStorage.key(i));
        const li = document.createElement('li');
        list.append(li);
        const h2 = document.createElement('h2');
        h2.innerHTML = localStorage.key(i)
        li.append(h2)
        const img = document.createElement('img');
        li.append(img)
        img.setAttribute("src", drawing)
        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = `Remove`
        li.append(removeBtn)
        removeBtn.addEventListener('click', removeDrawing)
    }

    function removeDrawing(e) {
        console.log(e.path[1])
        let currentDrawing = e.path[1].firstChild.innerHTML
        localStorage.removeItem(currentDrawing)
        e.path[1].remove();
    }
}