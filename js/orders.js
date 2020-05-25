fetch('http:/localhost:8080/orders')
    .then(response => response.json())
    .then(data => {
        if (data.status === 200) {
            renderOrder(data.orders, false)
            sort(data.orders)
            deleteOrder()
        }

        return data.orders
    })

const renderOrder = (orders, sortNew) => {
    let doc = new DOMParser()
    const orderdsDiv = document.querySelector('.orders > .row')

    if (orderdsDiv.children.length > 0) {
        orderdsDiv.innerHTML = ''
    }

    if (sortNew) {
        const length = orders.length
        for (let i = length - 1; i >= 0; i--) {
            const orderDivString = `
                <div class="card col-xl-3 order-card">
                    <div class="card-body">
                        <div class="row align-items-center justify-content-between" style="margin-bottom: 20px;">
                            <p>${orders[i].typeEvent}</p>
                            <i class="fa fa-trash" data-id=\`${orders[i]._id}\` id="deleteOrder"></i>
                        </div>
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
            renderModal(e.target.dataset.lastname)
        }))
        return;
    }

    for (let i = 0; i < orders.length; i++) {
        const orderDivString = `
            <div class="card col-xl-3 order-card">
                    <div class="card-body">
                        <div class="row align-items-center justify-content-between" style="margin-bottom: 20px;">
                            <p>${orders[i].typeEvent}</p>
                            <i class="fa fa-trash" data-id="${orders[i]._id}" id="deleteOrder"></i>
                        </div>
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
        renderModal(e.target.dataset.lastname)
    }))
}


const sort = orders => {
    const drpMenuItems = Array.from(document.querySelector('.dropdown-menu').children)
    drpMenuItems.forEach(item => {
        item.addEventListener('click', e => {
            console.log(e.target.dataset)
            switch (e.target.dataset.sort) {
                case 'new':
                    renderOrder(orders, true)
                    break
                case 'old':
                    renderOrder(orders, false)
                    break
            }
        })
    })
}

const renderModal = (curOrder) => {


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
            if (data.status === 200) {
                const order = data.order
                console.log(order)
                let doc = new DOMParser()
                const modalBody = document.querySelector('.modal-body')
                if (modalBody.children.length > 0) {
                    modalBody.innerHTML = ''
                }

                let orderString = `
                   <ul class="order-detail-list">
                       <li> <b>Фамилия</b> ${order.last_name} </li>
                       <li> <b>Имя</b> ${order.first_name} </li>
                       <li> <b>Телефон</b> ${order.telephone} </li>
                       <li> <b>Дата</b> ${order.date} </li>
                       <li> <b>Тип мероприятия</b> ${order.typeEvent} </li>
                       <li> 
                        <b>Блюда</b>
                        <ul class="order-detail-list-menu">
                             ${order.editedDishes.map( dish => `<li>${dish.name}</li>`).join(' ')}
                        </ul>
                       </li>
                       <li> 
                        <b>Доп.услуги</b>
                        <ul class="order-detail-list-services">
                             ${order.services.map( service => `<li>${service.name}</li>`).join(' ')}
                        </ul>
                       </li>
                   </ul>
                `


                const docMenu = doc.parseFromString(orderString, 'text/html');
                modalBody.appendChild(docMenu.body.firstChild)
            }
        })
}


const deleteOrder = () => {
    const deleteOrder = document.querySelectorAll('#deleteOrder');
    deleteOrder.forEach( icon => {
        icon.addEventListener('click', e => {
            const id = e.target.dataset.id
            const url = new URL('http:/localhost:8080/order/delete')
            url.searchParams.set('id', id)

            fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            })
                .then( response => response.json() )
                .then( data => {
                    if (data.status === 200) {
                        console.log(data)
                        document.location.reload(true);
                    }
                } )
        })
    } )
}