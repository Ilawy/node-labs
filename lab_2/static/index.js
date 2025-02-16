


fetch("/api/getEmployees")
.then(d=>d.json())
.then(data=>{
    const ul = document.createElement("ul")
    ul.classList.add("cards")

    data.forEach(user=>{
        const profilePicEl = document.createElement("img")
        profilePicEl.classList.add("profile-picture")
        profilePicEl.src = `https://eu.ui-avatars.com/api/?name=${user.name}&size=250`

        const nameEl = document.createElement("b")
        nameEl.innerHTML = user.name        
        const rows = Object.entries(user).map(([key, value])=>{
          if(key === "name")return;
          const keyEl = document.createElement("span")
          keyEl.innerHTML = key

          const valueEl = document.createElement("span")          
          valueEl.innerHTML = value
          const row = document.createElement("div")
          row.classList.add("row")
          row.append(keyEl, valueEl)
          return row
        }).filter(Boolean)


        const li = document.createElement("li")
        li.append(profilePicEl, nameEl, ...rows)
        li.classList.add("card")
        ul.appendChild(li)
    })

    document.body.appendChild(ul)
})