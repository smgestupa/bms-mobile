<script>
    import { Preferences } from "@capacitor/preferences";
    import { Network } from "@capacitor/network";
    import { router } from "tinro";
    import { jwtToken } from "../lib/jwtToken.js";
    import toast from "svelte-french-toast";
    import Text from "../components/text_field/Text.svelte";
    import Password from "../components/text_field/Password.svelte";
    import Spinner from "$components/loading/Spinner.svelte";
    let username = "", password = "", userCode = "", isFetching = false;

    const loginUser = async () => {
        if ( !( await Network.getStatus() ).connected ) {
            toast.error( "No internet connection detected, try again later", {
                position: "bottom-center"
            } );
            return;
        }

        if ( !username.trim() || !password.trim() || !userCode.trim() ) {
            toast.error( "Please fill all fields before logging in", {
                position: "bottom-center"
            } );
            return;
        }

        isFetching = true;

        const req = await fetch( "http://[REPLACE WITH SPRING BOOT HOST]:8080/api/v1/auth/login", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify( {
                userCode,
                username,
                password
            } ) } );
        const res = await req.json();

        isFetching = false;
            
        if ( req.status !== 200 ) {
            toast.error( "User may not exist", {
                    position: "bottom-center"
                } );
            return;
        }

        await Preferences.set( {
                    key: "jwt",
                    value: JSON.stringify( res )
                } );

        $jwtToken = JSON.stringify( res );

        toast.success( "Welcome back!", {
            position: "bottom-center"
        } );

        router.goto( "/dashboard" );
    }
</script>

<div id="page">
    <!-- logo -->
    <header>
        <img 
            src="/large-logo.png" 
            alt="Alpha Book Management System" />
    </header>

    <div>
        <!-- input fields -->
        <section id="input">
            <div>
                <Text 
                    placeholder={ "Username" }
                    bind:value={ username } />
            </div>
            <div>
                <Password 
                    placeholder={ "Password" }
                    bind:value={ password } />
            </div>
            <div>
                <Text 
                    placeholder={ "User Code" }
                    bind:value={ userCode } />
            </div>
            <button on:click={ loginUser }>
                { #if isFetching }
                    <Spinner />
                { :else }
                    Log In
                { /if }
            </button>
        </section>
        <p id="register-instead">Don't have an account? <a href="/register">Register instead</a></p>
    </div>
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
        margin-top: 15%;
    }

    header > img {
        display: block;
        width: 150px;
        height: 150px;
        margin: 0 auto;
    }

    #page > div {
        width: 100%;
        margin: auto auto;
    }

    #input {
        max-width: 340px;
        margin: auto auto;
        padding: 0 10px;
    }

    #input > div {
        position: relative;
        width: 100%;
        max-width: 340px;
        height: 48px;
        margin-bottom: 13px;
    }

    #input > button {
        display: block;
        color: white;
        background-color: #E9A93A;
        outline: none;
        border: none;
        border-radius: 5px;
        width: 100%;
        height: 43px;
        margin: 3rem auto 0 auto;
        text-align: center;
        font-weight: 500;
        font-size: 1rem; /* 16px */
        line-height: 1.5rem; /* 24px */
    }

    #register-instead {
        color: #828282;
        margin: 1.5rem 0;
        font-size: 0.875rem; /* 14px */
        line-height: 1.25rem; /* 20px */
        text-align: center;
    }

    #register-instead > a {
        color: #00aff4;
        font-weight: 600;
        text-decoration: none;
    }
</style>