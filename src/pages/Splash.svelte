<script>
    import { Preferences } from "@capacitor/preferences";
    import { router } from "tinro";
    import { onMount } from "svelte";
    import { jwtToken } from "../lib/jwtToken.js";

    const initializeApp = async () => {
        const { value } = await Preferences.get( { key: "jwt" } );
        if ( value === null ) router.goto( "/login" );
        else {
            jwtToken.set( value );
            router.goto( "/dashboard" );
        }
    }

    onMount( () => setTimeout( initializeApp, 1000 ) );
</script>

<div id="page">
    <!-- logo -->
    <header>
        <img 
            src="/large-logo-nameless.png" 
            alt="Alpha Book Management System" />
    </header>
</div>

<style>
    #page {
        display: flex;
        flex-direction: column;
        background-color: #2f2f2f;
        height: 100%;
    }

    header {
        display: flex;
        margin: auto auto;
    }

    header > img {
        display: block;
        width: 150px;
        height: 150px;
        margin: 0 auto;
        animation-name: rotate__logo;
        animation-duration: 2s;
        animation-iteration-count: infinite;
    }

    @keyframes rotate__logo {
        0% {
            transform: rotate( 0deg );
        }

        100% {
            transform: rotate( 360deg );
        }
    }
</style>