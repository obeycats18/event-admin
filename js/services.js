fetch('http:/localhost:8080/services')
    .then(response => response.json())
    .then(data => {
        if (data.status === 200) {
            renderServices(data.services)
            sendService()
            deleteService()
        }

    })

const renderServices = services => {
    let doc = new DOMParser()
    const servicesDiv = document.querySelector('.services ')
    services.forEach((service, index) => {
        const serviceDivStr = `
            <div class='row justify-content-around' style='margin-bottom: 10px;'>
                <div class='col-xl-6'>
                    <span>${service.name}</span>
                </div>
                <div class='col-xl-5 cost-block' style='text-align: right'>
                    <span>${service.cost} грн</span>
                </div>
                <div class='col-xl-1 cost-block' style='text-align: right'>
                    <i class="fa fa-trash" data-id="${service._id}" id="deleteService"></i>
                </div>
            </div>
        
        `

        const docMenu = doc.parseFromString(serviceDivStr, 'text/html');
        servicesDiv.appendChild(docMenu.body.firstChild)
    })


}


const sendService = () => {
    const sendMenuBtn = document.querySelector('#sendService')

    const name = document.querySelector('#service-name')
    const cost = document.querySelector('#service-cost')

    sendMenuBtn.addEventListener('click', e => {

        fetch('http:/localhost:8080/services/create', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                name: name.value,
                cost: cost.value,
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    console.log(data)
                    document.location.reload(true);
                }

            })

    })
}

const deleteService = () => {
    const deleteService = document.querySelectorAll('#deleteService');
    deleteService.forEach( icon => {
        icon.addEventListener('click', e => {
            const id = e.target.dataset.id
            const url = new URL('http:/localhost:8080/services/delete')
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