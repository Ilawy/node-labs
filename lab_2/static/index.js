


fetch("/api/getEmployees")
.then(d=>d.json())
.then(data=>{
    const ul = document.createElement("ul")
    ul.classList.add("cards")

    data.forEach(user=>{
        const liData = Object.entries(user).map(([key, value])=>{
            return `${key}: ${value}`
        }).join("<br />")

        const li = document.createElement("li")
        li.classList.add("card")
        li.innerHTML = liData
        ul.appendChild(li)
    })

    document.body.appendChild(ul)
})