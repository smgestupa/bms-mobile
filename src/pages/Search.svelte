<script>
    import { Preferences } from "@capacitor/preferences";
    import toast from "svelte-french-toast";
    import { get } from "svelte/store";
    import { jwtToken } from "../lib/jwtToken.js";
    import SearchBig from "../components/text_field/SearchBig.svelte";
    import BookPreviewSmall from "../components/book/BookPreviewSmall.svelte";
    export let search;
    let type, token, books = [];

    const jwt = JSON.parse( get( jwtToken ) );
    type = jwt.type;
    token = jwt.token;
    
    const findBooks = async () => {
        const req = await fetch( `http://[REPLACE WITH SPRING BOOT HOST]:8080/api/v1/books/search?t=${ search }`, {
            headers: {
                "Accept": "application/json",
                "Authorization": `${ type } ${ token }`
            }
        } );
        const res = await req.json();
        books = res ?? [];
    }

    const searchBook = async ( e ) => {
        if ( e.key !== "Enter" ) return;
        if ( !search.trim() ) {
            toast.error( "You cannot leave the search empty", {
                    position: "bottom-center"
                } );
                return;
        } 

        const req = await fetch( `http://[REPLACE WITH SPRING BOOT HOST]:8080/api/v1/books/search?t=${ search }`, {
            headers: {
                "Accept": "application/json",
                "Authorization": `${ type } ${ token }`
            }
        } );
        const res = await req.json();
        books = res ?? [];
    }
</script>

<div id="page">
    <div>
        <header>
            <!-- back -->
            <a href="/dashboard">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="28" height="28"><path fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M328 112L184 256l144 144"/></svg>
            </a>
            <!-- search -->
            <section id="search-box">
                <SearchBig 
                    placeholder={ "Search   " }
                    bind:value={ search } 
                    on:keydown={ e => searchBook( e ) } />
            </section>
        </header>
        { #await findBooks() }
            <p>
                Fetching books
                <span>Please wait...</span>
            </p>
        { :then _ }
            { #if books.length === undefined || books.length === 0 }
                <p>
                    No books found
                    <span>Please try using another term...</span>
                </p>
            { :else }
                <ul>
                    { #each books as book }
                        <li>
                            <BookPreviewSmall { book } />
                        </li>
                    { /each }
                </ul>
            { /if }
        { :catch err }
            <p>
                { err.message }
                <span>Something went wrong!</span>
            </p>
        { /await }
    </div>
</div>

<style>
    #page {
        background-color: #2f2f2f;
        height: 100%;
        overflow-y: scroll;
    }

    #page > div {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding-top: 1.5rem;
    }

    #page > div > header {
        display: flex;
        align-items: center;
        margin: 0;
        margin-bottom: 1.5rem;
        padding: 0 1rem;
    }

    #page > div > header > a {
        border: none;
        outline: none;
        background: none;
    }

    #search-box {
        width: 100%;
    }

    #page > div > p {
        text-align: center;
        position: absolute;
        color: white;
        padding: 0;
        font-weight: 600;
        font-size: 1.25rem; /* 20px */
        line-height: 1.75rem; /* 28px */
        width: fit-content;
        height: fit-content;
        top: 50%;
        left: 50%;
        transform: translateX( -50% );
    }

    #page > div > p > span {
        color: #A7A7A7;
        display: block;
        font-weight: 500;
        font-size: 1rem; /* 16px */
        line-height: 1.5rem; /* 24px */
    }


    #page > div > ul {
        display: grid;
        grid-template-columns: repeat(2, auto);
        justify-content: space-between;
        margin: 0;
        padding: 0;
        padding: 0 1rem;
    }

    #page > div > ul > li {
        margin: 0 0 12px 0;
        padding: 0;
    }
</style>