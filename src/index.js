//DOM Element
const quotesUl = document.querySelector("#quote-list")
const newQuote = document.querySelector("#new-quote-form")

function renderOneQuote(quoteObj) {
    //bandage for likes being undefined
    quoteObj.likes ? objLikes = quoteObj.likes.length : objLikes = 0

    const quoteLi = document.createElement("li")
    quoteLi.className = 'quote-card'
    quoteLi.dataset.id = quoteObj.id
    quoteLi.innerHTML = `
    <blockquote class="blockquote">
        <p class="mb-0">${quoteObj.quote}</p>
        <footer class="blockquote-footer">${quoteObj.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${objLikes}</span></button>
        <button class='btn-danger'>Delete</button>
    </blockquote>
    `
    quotesUl.append(quoteLi)
    const deleteBtn = quoteLi.querySelector('.btn-danger')
    deleteBtn.addEventListener("click", handleDelete)
    const likeBtn = quoteLi.querySelector('.btn-success')
    likeBtn.addEventListener("click", handleLike)
}

function renderAllQuotes(quotes) {
    quotes.forEach(renderOneQuote)
}

//Event Listeners
function handleLike(e) {
    const quoteLi = e.target.parentElement.parentElement
    postLike(quoteLi)
    getQuote(quoteLi).then(data => {
        e.target.innerText = `Likes: ${data.likes.length}`
    })
}

function handleDelete(e) {
    const quoteLi = e.target.parentElement.parentElement
    //optimistic removal
    quoteLi.remove()
    deleteQuote(quoteLi)
}

newQuote.addEventListener("submit", handleSubmit)

function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    newQuoteAuthor = form.author.value
    newQuoteQuote = form.quote.value

    newQuoteObj = {
        quote: newQuoteQuote,
        author: newQuoteAuthor
    }

    postQuote(newQuoteObj).then(renderOneQuote)
}

//Fetch Data
//Post a like
function postLike(data) {
    return fetch("http://localhost:3000/likes", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({quoteId: parseInt(data.dataset.id)})
    })
    .then(res => res.json())
}

//Post new quote
function postQuote(newData) {
    return fetch("http://localhost:3000/quotes", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(newData)
    })
    .then(res => res.json())
}
//Delete One Quote
function deleteQuote(data) {
    return fetch(`http://localhost:3000/quotes/${data.dataset.id}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
}
//Get One Quote
function getQuote(data) {
    return fetch(`http://localhost:3000/quotes/${data.dataset.id}?_embed=likes`)
    .then(res => res.json())
}
//Get all quotes
function fetchQuotes() {
    return fetch("http://localhost:3000/quotes?_embed=likes")
    .then(response => response.json())
    .then(data => data)
}

//Initialize and Render
fetchQuotes().then(renderAllQuotes)