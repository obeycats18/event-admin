fetch('http:/localhost:8080/menus')
    .then(response => response.json())
    .then(data => {
        if(data.status === 200) {
            renderMenus(data.menu)
            createMenu()
            sendMenu()
        }

    })

const renderMenus = menus => {
    let doc = new DOMParser()
    const menuDiv = document.querySelector('.menus > .row')
    console.log('here')
    menus.forEach( menu => {
        const menuDivStr = `
            <div class="card col-xl-3 menu-card" ">
                <div class="card-body">
                    <h5 class="card-title">${menu.name}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">Блюда</h6>
                    <div class="dishes" style="max-height: 150px;overflow-y: auto;">
                        ${menu.dishes.map( dishes => `<p> ${dishes.name} </p>` ).join(' ')}
                    </div>
                </div>
            </div>
        `

        const docMenu = doc.parseFromString(menuDivStr, 'text/html');
        menuDiv.appendChild(docMenu.body.firstChild)
    })
}

const createMenu = () => {
    const createMenuBtn = document.querySelector('#createMenuBtn')
    createMenuBtn.addEventListener('click', (e) => {
        e.preventDefault()
        fetch('http:/localhost:8080/dishes')
        .then(response => response.json())
        .then(data => {
            if(data.status === 200) {
                console.log(data)
                renderModalDishes(data.dishes)
            }

        })

    })
}

const renderModalDishes = dishes => {
    let doc = new DOMParser()
    const menuDishes = document.querySelector('#menu-dishes')
    
    if(menuDishes.children.length === 0) {
        dishes.forEach( dish => {
            const dishStr = `
                <div class="form-check">
                    <input type="checkbox" class="form-check-input" data-id="${dish._id}" id="${dish._id}">
                    <label class="form-check-label" for="${dish._id}">${dish.name}</label>
                </div>
            `
    
            const docMenu = doc.parseFromString(dishStr, 'text/html');
            menuDishes.appendChild(docMenu.body.firstChild)
        })
    }
    
}

const sendMenu = () => {
    const sendMenuBtn = document.querySelector('#sendMenu')
    sendMenuBtn.addEventListener('click', e => {
        const checkboxes = Array.from(document.querySelectorAll('.form-check-input'))
        const menuName = document.querySelector('#menu-name')

        const checkedCheckbox = checkboxes.filter( checkbox => checkbox.checked).map( checked => checked.dataset.id)

        fetch('http:/localhost:8080/menu/create', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ name: menuName.value, dishes: checkedCheckbox })
        })
            .then(response => response.json())
            .then(data => {
                if(data.status === 200) {
                    console.log(data)
                    document.location.reload(true); 
                }

            })

    })
}
