fetch('http:/localhost:8080/orders')
    .then(response => response.json())
    .then(data => {
        if(data.status === 200) {
            renderOrder(data.orders, false)
            sort(data.orders)
        }

        return data.orders
    })

const renderOrder = (orders, sortNew) => {
    let doc = new DOMParser()
    const orderdsDiv = document.querySelector('.orders > .row')

    if(orderdsDiv.children.length > 0){
        orderdsDiv.innerHTML = ''
    }
 
    if(sortNew) {
        const length = orders.length
        for(let i = length-1; i >= 0; i--) {
            const orderDivString = `
                <div class="card col-xl-3 order-card">
                    <div class="card-body">
                        <h5 class="card-title">${orders[i].typeEvent}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${orders[i].date}</h6>
                        <p class="card-text">${orders[i].count_peoples} человек</p>
                        <p class="card-text">${orders[i].cost ? `${orders[i].cost} грн` : '<br>'}</p>
                        <a href="#" data-lastname="${orders[i].last_name}" data-toggle="modal" data-target="#detail" class="card-link">Детали заказа</a>
                    </div>
                </div>
            `
    
            const docMenu = doc.parseFromString(orderDivString, 'text/html');
            orderdsDiv.appendChild(docMenu.body.firstChild)
        }
        const ordersA = Array.from(document.querySelectorAll('.card-link'))
        ordersA.forEach(order => order.addEventListener('click', e => {
            console.log(e.target.dataset)
            renderModal( e.target.dataset.lastname)
        }))
        return;
    }

    for(let i = 0; i < orders.length; i++) {
        const orderDivString = `
            <div class="card col-xl-3 order-card" ">
                <div class="card-body">
                    <h5 class="card-title">${orders[i].typeEvent}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${orders[i].date}</h6>
                    <p class="card-text">${orders[i].count_peoples} человек</p>
                    <p class="card-text">${orders[i].cost ? `${orders[i].cost} грн` : '<br>'} </p>
                    <a href="#" data-lastname="${orders[i].last_name}" data-toggle="modal" data-target="#detail" class="card-link">Детали заказа</a>
                </div>
            </div>
        `

        const docMenu = doc.parseFromString(orderDivString, 'text/html');
        orderdsDiv.appendChild(docMenu.body.firstChild)
    }

    const ordersA = Array.from(document.querySelectorAll('.card-link'))
    ordersA.forEach(order => order.addEventListener('click', e => {
        console.log(e.target.dataset)
        renderModal( e.target.dataset.lastname)
    }))
}


const sort = orders => {
    const drpMenuItems = Array.from(document.querySelector('.dropdown-menu').children)
    drpMenuItems.forEach(item => {
        item.addEventListener('click', e => {
            console.log(e.target.dataset)
            switch(e.target.dataset.sort){
                case 'new': renderOrder(orders, true)
                break
                case 'old': renderOrder(orders, false)
                break
            }
        } )
    })

    
    
}

const renderModal = (curOrder) => {
    
    console.log(curOrder)
    const url = new URL('http:/localhost:8080/order')
    url.searchParams.set('lastName', curOrder)

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    })
        .then(response => response.json())
        .then(data => {
            if(data.status === 200) {

                let doc = new DOMParser()
                const modalBody = document.querySelector('.modal-body')

                if(modalBody.children.length > 0) {
                    modalBody.innerHTML = ''
                }

                let orderString = '<div>'

                for (let key in data.order) {
                    if(typeof data.order[key] === 'string' && key !== '_id') {
                        orderString += `
                            <p> 
                                <b> ${key}</b>
                                ${data.order[key]}
                            </p> <br>
                        `
                    }
                }

                orderString += "<b>Блюда</b>"
                let dishesStr = data.order.editedDishes.map( dishes => `<p> ${dishes.name} </p> <br>` ).join(' ')
                orderString += dishesStr
                orderString += "<b>Доп.услуги</b>"
                let servicesStr = data.order.services.map( service => `<p> ${service.name} </p> <br>` ).join(' ')
                orderString += servicesStr
                
                orderString += '</div>  '


                const docMenu = doc.parseFromString(orderString, 'text/html');
                modalBody.appendChild(docMenu.body.firstChild)
            }
        })

    

}