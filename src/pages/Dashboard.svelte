<script>
    import { Network } from "@capacitor/network";
    import { Preferences } from "@capacitor/preferences";
    import { router } from "tinro";
    import { get } from "svelte/store";
    import { jwtToken } from "../lib/jwtToken.js";
    import toast from "svelte-french-toast";
    import SearchBig from "../components/text_field/SearchBig.svelte";
    import BookPreview from "../components/book/BookPreview.svelte";
    import Spinner from "$components/loading/Spinner.svelte";
    let search ="", isFetching = false;

    let userCode, photo, firstName, type, token;
    const jwt = JSON.parse( get( jwtToken ) );

    userCode = jwt.userCode;
    photo = jwt.photo;
    firstName = jwt.firstName;
    type = jwt.type;
    token = jwt.token;

    const logoutUser = async () => {
        await Preferences.remove( { key: "jwt" } );
        jwtToken.set( "" );
        router.goto( "/login" );
        toast.success( "Successfully logged out", {
                    position: "bottom-center" 
                } );
    }

    const searchBook = async ( e ) => {
        if ( !( await Network.getStatus() ).connected ) {
            toast.error( "No internet connection detected, try again later", {
                position: "bottom-center"
            } );
            return;
        }

        search = search.trim();

        if ( e.key !== "Enter" ) return;
        if ( !search ) {
            toast.error( "You cannot leave the search empty", {
                    position: "bottom-center"
                } );
                return;
        }

        if ( /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test( search ) )
            searchISBN();
        else router.goto( "/search?t=" + encodeURIComponent( search ) );
    }

    const searchISBN = async () => {
        isFetching = true;

        const req = await fetch( `http://[REPLACE WITH SPRING BOOT HOST]:8080/api/v1/books/${ search }`, {
            headers: {
                "Accept": "application/json",
                "Authorization": `${ type } ${ token }`
            } 
        } );
        const res = await req.json();

        isFetching = false;
        
        if ( req.status !== 200 ) router.goto( "/search?t=" + encodeURIComponent( search ) );
        else {
            router.goto( `/book/${ res.message }` );
        }
    }

    const getFavouriteBooks = async () => {
        if ( !( await Network.getStatus() ).connected ) {
            toast.error( "No internet connection detected, try again later", {
                position: "bottom-center"
            } );
            return;
        }

        let books = [];
        const req = await fetch( `http://[REPLACE WITH SPRING BOOT HOST]:8080/api/v1/books/favourites?userCode=${ userCode }`, {
            method: "get",
            headers: {
                "Accept": "application/json",
                "Authorization": `${ type } ${ token }`
            }
        } );
        const res = await req.json();
        books = res;

        return books;
    }

    const getRandomBooks = async () => {
        let books = [];
        const req = await fetch( "http://[REPLACE WITH SPRING BOOT HOST]:8080/api/v1/books/random?n=10", {
            method: "get",
            headers: {
                "Accept": "application/json",
                "Authorization": `${ type } ${ token }`
            }
        } );
        const res = await req.json();
        books = res;

        return books;
    }
</script>

<div id="page">
    <div>
        <header>
            <h1>Dashboard</h1>
            <section id="user-header">
                <!-- notification -->
                <button on:click={ logoutUser }>LOG OUT</button>
                <!-- user image -->
                <a href="/dashboard/profile">
                    { #if photo }
                        <img 
                                src="data:image/png;base64,{ photo }" 
                                alt="User"
                                width="32"
                                height="32">
                    { :else }
                        <img 
                            src="/blank-picture.jpg" 
                            alt="User"
                            width="32"
                            height="32">
                    { /if }
                </a>
            </section>
        </header>
        <section id="dashboard-msg">
            <header>
                <h1>Hello, { firstName ?? "undefined" } 👋</h1>
                <h6>What do you want to read today?</h6>
            </header>
        </section>
        <section id="search-box">
            { #if isFetching }
                <span>
                    <Spinner stroke="#9ca3af" />
                </span>
            { /if }
            <SearchBig 
                placeholder={ "Search" }
                bind:value={ search } 
                on:keydown={ searchBook } 
                disabled={ isFetching } />
        </section>
    </div>
</div>

<section id="book-display">
    <!-- favourite books -->
    <div>
        <header>
            <h1>Favourite books</h1>
        </header>
        { #await getFavouriteBooks() }
            <p>
                Fetching books
                <span>Please wait...</span>
            </p>
        { :then books }
            { #if !books || books.length === 0 }
                <p>
                    You have no favourite books
                    <span>Try searching some...</span>
                </p>
            { :else }
                <ul>
                    { #each books as book }
                        <li>
                            <BookPreview { book } />
                        </li>
                    { /each }
                    <div></div>
                </ul>
            { /if }
        { :catch err }
            <p>
                { err.message }
                <span>Something went wrong!</span>
            </p>
        { /await }
    </div>
    <!-- more books -->
    <div>
        <header>
            <h1>More books for you</h1>
        </header>
        { #await getRandomBooks() }
            <p>
                Fetching books
                <span>Please wait...</span>
            </p>
        { :then books }
            { #if !books || books.length === 0 }
                <p>
                    Could not show random books
                    <span>Try searching some instead...</span>
                </p>
            { :else }
                <ul>
                    { #each books as book }
                        <li>
                            <BookPreview { book } />
                        </li>
                    { /each }
                    <div></div>
                </ul>
            { /if }
        { :catch err }
            <p>
                { err.message }
                <span>Something went wrong!</span>
            </p>
        { /await }
    </div>
</section>

<style>
    #page {
        display: flex;
        flex-direction: column;
        background-color: #2f2f2f;
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
        justify-content: space-between;
        padding: 0 1rem;
    }

    #page > div > header > h1 {
        color: #A7A7A7;
        margin: 0;
        padding: 0;
        font-size: 1.125rem; /* 18px */
        line-height: 1.75rem; /* 28px */
    }

    #user-header {
        display: flex;
        align-items: center;
    }

    #user-header > * {
        margin-left: 1rem;
    }

    #user-header > button {
        color: #ff0000;
        position: relative;
        display: flex;
        outline: none;
        border: 1px solid #ff0000;
        border-radius: 2px;
        background: none;
        align-items: center;
        font-weight: 600;
        padding: 5px 1rem;
        height: fit-content;
    }
    
    #user-header > a > img {
        border-radius: 9999px;
    }

    #dashboard-msg {
        margin: 10px 0;
    }

    #dashboard-msg * {
        margin: 0;
        padding: 0;
    }

    #dashboard-msg > header {
        margin: 0 1rem;
    }

    #dashboard-msg > header > h1 {
        color: white;
        font-weight: 700;
        font-size: 1.5rem; /* 24px */
        line-height: 2rem; /* 32px */
        margin-bottom: 7px;
    }

    #dashboard-msg > header > h6 {
        color: #A7A7A7;
        font-size: 0.875rem; /* 14px */
        line-height: 1.25rem; /* 20px */
    }

    #search-box {
        position: relative;
        margin: 1rem 0 10px 0;
    }

    #search-box > span {
        position: absolute;
        display: block;
        top: 25%;
        bottom: 25%;
        left: 25%;
        right: 25%;
    }

    #book-display {
        background-color: #2f2f2f;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        min-height: 10%;
        overflow-y: scroll;
    }

    #book-display > div {
        margin-bottom: 1rem;
    }

    #book-display > div > header {
        margin: 0 1.25rem 1rem 1.25rem;
    }

    #book-display > div > header > h1 {
        color: #E3D4B5;
        font-weight: 700;
        font-family: 'Ibarra Real Nova';
        font-size: 1.25rem; /* 20px */
        line-height: 1.75rem; /* 28px */
    }

    #book-display > div > p {
        text-align: center;
        color: white;
        margin: 0 1.25rem 1rem 1.25rem;
        padding: 0;
        font-weight: 600;
        font-size: 1.25rem; /* 20px */
        line-height: 1.75rem; /* 28px */
    }

    #book-display > div > p > span {
        color: #A7A7A7;
        display: block;
        font-weight: 500;
        font-size: 1rem; /* 16px */
        line-height: 1.5rem; /* 24px */
    }

    #book-display > div > ul {
        display: flex;
        overflow-x: scroll;
        margin: 0;
        padding: 0 1rem;
    }

    #book-display > div > ul > li:first-child {
        margin-left: 0;
    }

    #book-display > div > ul > li {
        margin-left: 1rem;
    }

    #book-display > div > ul > div {
        margin-left: 1rem;
        border: 1px solid transparent;
    }
</style>