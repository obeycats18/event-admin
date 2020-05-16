fetch('http:/localhost:8080/dishes')
    .then(response => response.json())
    .then(data => {
        if(data.status === 200) {
            renderDishes(data.dishes)
            sendDish()
        }

    })

const renderDishes = dishes => {
    let doc = new DOMParser()
    const dishesDiv = document.querySelector('.dishes ')
    dishes.forEach( (dish, index) => {
        const dishDivStr = `
            <div class='row justify-content-around' style='margin-bottom: 10px;'>
                <div class='col-xl-4'>
                    <span>${dish.name}</span>
                </div>
                <div class='col-xl-4 cost-block' style='text-align: right'>
                    <span>${dish.cost} грн/чел</span>
                </div>
                <div class='col-xl-4 weight-block' style='text-align: right'>
                    <span>${dish.weight ? dish.weight : '0'} грамм</span>
                </div>
            </div>
        
        `

        const docMenu = doc.parseFromString(dishDivStr, 'text/html');
        console.log(docMenu.body.firstChild)
        dishesDiv.appendChild(docMenu.body.firstChild)
    })
}



const sendDish = () => {
    const sendMenuBtn = document.querySelector('#sendDish')

    const name = document.querySelector('#dish-name')
    const cost = document.querySelector('#dish-cost')
    const weight = document.querySelector('#dish-weight')
    const composition = document.querySelector('#dish-composition')


    sendMenuBtn.addEventListener('click', e => {

        fetch('http:/localhost:8080/dish/create', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ name: name.value, cost: cost.value, composition: composition.value, weight: weight.value, })
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
