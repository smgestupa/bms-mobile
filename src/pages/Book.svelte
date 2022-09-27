
<script>
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import toast from "svelte-french-toast";
    import { jwtToken } from "../lib/jwtToken.js";
    export let id;
    let userCode, type, token, book = {}, favourite = false, isbn10 = "", isbn13 = "";

    const jwt = JSON.parse( get( jwtToken ) );
    userCode = jwt.userCode;
    type = jwt.type;
    token = jwt.token;

    const fetchBook = async () => {
        const req = await fetch( `http://[REPLACE WITH SPRING BOOT HOST]:8080/api/v1/books/get`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `${ type } ${ token }`
            },
            body: JSON.stringify( {
                userCode,
                bookID: id
            } )
        } );
        const res = await req.json();
        book = res;
        favourite = book.favourite;
        isbn10 = book.bookCodes.isbn10;
        isbn13 = book.bookCodes.isbn13;
    }

    const favouriteBook = async () => {
        const req = await fetch( `http://[REPLACE WITH SPRING BOOT HOST]:8080/api/v1/books/fav`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `${ type } ${ token }`
            },
            body: JSON.stringify( {
                userCode,
                bookID: id
            } )
        } );
        const res = await req.json();

        if ( req.status === 200 ) {
            toast.success( res.message, {
                position: "bottom-center"
            } );
            favourite = !favourite  ;
        }
    }

    onMount( fetchBook );
</script>

<div id="page">
    <header>
        <!-- back -->
        <a href="/dashboard">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="28" height="28"><path fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M328 112L184 256l144 144"/></svg>
        </a>
        <!-- favourite -->
        <button on:click={ favouriteBook }>
        { #if favourite }
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="28" height="28"><path fill="white" d="M256 448a32 32 0 01-18-5.57c-78.59-53.35-112.62-89.93-131.39-112.8-40-48.75-59.15-98.8-58.61-153C48.63 114.52 98.46 64 159.08 64c44.08 0 74.61 24.83 92.39 45.51a6 6 0 009.06 0C278.31 88.81 308.84 64 352.92 64c60.62 0 110.45 50.52 111.08 112.64.54 54.21-18.63 104.26-58.61 153-18.77 22.87-52.8 59.45-131.39 112.8a32 32 0 01-18 5.56z"/></svg>
        { :else }
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="28" height="28"><path d="M352.92 80C288 80 256 144 256 144s-32-64-96.92-64c-52.76 0-94.54 44.14-95.08 96.81-1.1 109.33 86.73 187.08 183 252.42a16 16 0 0018 0c96.26-65.34 184.09-143.09 183-252.42-.54-52.67-42.32-96.81-95.08-96.81z" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
        { /if }
        </button>
    </header>
    <section id="display">
        <figure>
            { #if book.cover }
                <img src="data:image/png;base64,{ book.cover }" alt="Default Cover">
            { :else }
                <img src="/large-logo.png" alt="Default Cover">
            { /if }
        </figure>
        <!-- book information -->
        <ul>
            <li><p>Rating</p></li>
            <li><p>Pages</p></li>
            <li><p>Language</p></li>
            <li><p>{ book.rating }</p></li>
            <li><p>{ book.pages ?? "N/A" }</p></li>
            <li><p>ENG</p></li>
        </ul>
    </section>
    <section id="details">
        <h1>{ book.title ?? "No proper title found" }</h1>
        <h2>{ book.author ? `By ${ book.author }` : "No author found" }</h2>
        <header>
            <h1>About the Book</h1>
        </header>
        <p>{ book.description }</p>
        <ul>
            <li><p>Author <span>{ book.author ?? "Missing" }</span></p></li>
            <li><p>Publisher <span>{ book.publisher ?? "Missing" }</span></p></li>
            <li><p>Publish Date <span>{ book.publishDate ?? "Missing" }</span></p></li>
            <li><p>Rating <span>{ book.rating }</span></p></li>
            <li><p>Pages <span>{ book.pages ?? "N/A" }</span></p></li>
            <li><p>Language <span>ENG</span></p></li>
            <li><p>ISBN10 <span>{ isbn10 ?? "Missing" }</span></p></li>
            <li><p>ISBN13 <span>{ isbn13 ?? "Missing" } </span></p></li>
        </ul>
    </section>
    <button id="start-reading">Start Reading</button>
</div>

<style>
    #page {
        display: flex;
        flex-direction: column;
        background-color: #2f2f2f;
        height: 100%;
        overflow-y: scroll;
    }

    #page > header {
        position: absolute;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        margin: 0;
        margin-top: 1.5rem;
        padding: 0 1rem;
    }

    #page > header > button, a {
        border: none;
        outline: none;
        background: none;
    }

    #display {
        display: flex;
        flex-direction: column;
        background: linear-gradient(163.32deg, rgba(192, 0, 0, 0.7) 6.53%, rgba(197, 130, 0, 0.7) 96.69%);
        height: 450px;
        margin: 0;
        padding: 0;
    }

    #display > figure {
        fill: white;
        position: relative;
        margin: 0;
        padding: 0;
        margin: auto auto;
        width: fit-content;
        height: fit-content;
    }

    #display > figure > img {
        background-color: white;
        object-fit: cover;
        display: block;
        width: 220px;
        height: 300px;
        border: 5px solid white;
        border-radius: 13.2px;
    }

    #display > ul {
        display: grid;
        color: white;
        grid-template-columns: repeat(3, auto);
        margin: 1.5rem auto;
        padding: 0;
        width: fit-content;
        border: 1px solid rgba(245, 245, 245, 0.31);
        border-radius: 8px;
    }

    #display > ul > li {
        margin: 7px 0;
        padding: 0;
        text-align: center;
        padding: 0 1.5rem;
        height: fit-content;
    }

    #display > ul > li > p {
        margin: 0;
        padding: 0;
    }

    
    #details {
        flex-grow: 1;
        margin: 0;
        margin-top: 1rem;
        padding: 0 1rem;
        overflow-y: scroll;
    }

    #details > h1 {
        color: white;
        text-align: center;
        margin: 0;
        padding: 0;
        font-weight: 600;
        font-size: 1.25rem; /* 20px */
        line-height: 1.75rem; /* 28px */
    }

    #details > h2 {
        text-align: center;
        color: #858585;
        font-size: 0.875rem; /* 14px */
        line-height: 1.25rem; /* 20px */
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
        margin: 0;
        padding: 0;
        margin-bottom: 13px;
    }
    
    #details > header {
        display: flex;
        align-items: center;
        height: 22px;
    }
    
    #details > header > h1 {
        color: white;
        margin: 0;
        padding: 0;
        font-size: 0.875rem; /* 14px */
        line-height: 1.25rem; /* 20px */
    }

    #details > p {
        overflow-wrap: break-word;
        color: #A7A7A7;
        margin: 1px 0;
        padding: 0;
        font-size: 1rem; /* 16px */
        line-height: 1.5rem; /* 24px */
    }

    #details > ul {
        color: white;
        margin: 0;
        margin-top: 2rem;
        padding: 0;
        font-size: 0.875rem; /* 14px */
        line-height: 1.25rem; /* 20px */
    }

    #details > ul > li {
        margin: 10px 0;
    }

    #details > ul > li > p {
        font-weight: 600;
        margin: 0;
        padding: 0;
    }

    #details > ul > li > p > span {
        margin-left: 1rem;
        font-weight: 500;
        color: #A7A7A7;
    }

    #start-reading {
        flex-shrink: 0;
        color: white;
        outline: none;
        border: none;
        background-color: #E9A93ADE;
        border-radius: 8px;
        height: 42px;
        margin: 1rem 1rem;
        font-weight: 600px;
    }
</style>