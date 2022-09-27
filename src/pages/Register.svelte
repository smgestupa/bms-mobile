<script>
    import { router } from "tinro";
    import toast from "svelte-french-toast";
    import Text from "../components/text_field/Text.svelte";
    import Password from "../components/text_field/Password.svelte";
    import Spinner from "$components/loading/Spinner.svelte";
    let firstName = "", lastName = "", username = "", password = "", userCode = "", isTeacher = false, isFetching = false;

    const registerUser = async () => {
        if ( !userCode.trim() && userCode.length !== 7 ) {
            toast.error( "Missing/improper user code" );
            return;
        }

        if ( !firstName.trim() ) {
            toast.error( "Missing first name" );
            return;
        }

        if ( !lastName.trim() ) { 
            toast.error( "Missing last name" );
            return;
        }

        if ( !username.trim() ) {
            toast.error( "Missing username" );
            return;
        }

        if ( !password.trim() ) {
            toast.error( "Missing password" );
            return;
        }

        isFetching = true;
        
        const roles = [ "user", isTeacher ? "teacher" : "student" ];
        const res = await fetch( "http://[REPLACE WITH SPRING BOOT HOST]:8080/api/v1/auth/register", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify( {
                userCode,
                firstName,
                lastName,
                username,
                password,
                roles
            } )
        } );
        const req = await res.json();

        isFetching = false;
        
        if ( res.status === 201 ) {
            toast.success( req.message, {
                position: "bottom-center"
             } );
            router.goto( "/login" );
        } else toast.error( req.message, {
                position: "bottom-center"
            }  );
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
                    placeholder={ "First Name" }
                    maxlength={ 32 }
                    bind:value={ firstName } />
            </div>
            <div>
                <Text 
                    placeholder={ "Last Name" }
                    maxlength={ 32 }
                    bind:value={ lastName } />
            </div>
            <div>
                <Text 
                    placeholder={ "Username" }
                    maxlength={ 16 }
                    bind:value={ username } />
            </div>
            <div>
                <Password 
                    placeholder={ "Password" }
                    maxlength={ 60 }
                    bind:value={ password } />
            </div>
            <div>
                <Text 
                    placeholder={ "User Code" }
                    maxlength={ 7 }
                    bind:value={ userCode } />
            </div>
            <label id="user-type">
                <input type="checkbox" checked={ isTeacher } />
                <span>Is this user a Teacher?</span>
            </label>
            <button on:click={ registerUser }>
                { #if isFetching }
                    <Spinner />
                { :else }
                    Create Account
                { /if }
            </button>
        </section>
        <p id="register-instead">Already have an account? <a href="/login">Log in instead</a></p>
    </div>
</div>

<style>
    #page {
        display: flex;
        flex-direction: column;
        background-color: #2f2f2f;
        height: 100%;
        overflow-y: auto;
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

    #user-type {
        display: flex;
        color: #828282;
        width: fit-content;
        margin: 1rem 0;
        font-size: 0.875rem; /* 14px */
        line-height: 1.25rem; /* 20px */
    }

    #user-type > input[ type="checkbox" ] {
        outline: none;
        background-color: white;
        background: none;
        border-radius: 2px;
        height: 20px;
        width: 20px;
        margin: auto 0;
    }

    #user-type > input[ type="checkbox" ]:after {
        position: relative;
        display: block;
    }

    #user-type > input[ type="checkbox" ]:checked:after {
        border: none;
        content: "✓";
        color: black;
        font-weight: 1000;
        width: fit-content;
        margin: 0 auto;
    }

    #user-type > span {
        display: inline-block;
        height: 100%;
        margin-left: 10px;
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