<script>
    import { Preferences } from "@capacitor/preferences";
    import { Network } from "@capacitor/network";
    import toast from "svelte-french-toast";
    export let openEditor, bio, updateProfile;
    let draft = bio;

    const updateDescription = async () => {
        if ( !( await Network.getStatus() ).connected ) {
            toast.error( "No internet connection detected, try again later", {
                position: "bottom-center"
            } );
            return;
        }

        const details = JSON.parse( ( await Preferences.get( { key: "jwt" } ) ).value );
        details.bio = draft;

        fetch( "http://[REPLACE WITH SPRING BOOT HOST]:8080/api/v1/user/update", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `${ details.type } ${ details.token }`
            },
            body: JSON.stringify( {
                userCode: details.userCode,
                photo: null,
                bio: details.bio
            } ) } )
            .then( async res => {
                if ( res.status === 200 ) {
                    await Preferences.set( { 
                        key: "jwt",
                        value: JSON.stringify( details )
                    } );
                    bio = details.bio;
                    openEditor = !openEditor;
                    updateProfile();
                    toast.success( "Successfully updated the description", {
                        position: "bottom-center"
                    } );
                }
            } )
            .catch( e => {
                toast.error( e.message, {
                    position: "bottom-center"
                } );
            } );
    }
</script>

<div>
    <section>
        <header>
            <h1>Description</h1>
            <button on:click={ () => openEditor = !openEditor }>Discard</button>
        </header>
        <textarea bind:value={ draft }></textarea>
        <button on:click={ updateDescription }>Save description</button>
    </section>
</div>

<style>
    div {
        position: absolute;
        display: flex;
        align-items: center;
        background-color: rgb(0, 0, 0, 0.25);
        justify-content: center;
        width: 100%;
        height: 100%;
        z-index: 10;
    }

    div > section {
        background-color: #2f2f2f;
        border-radius: 2px;
        width: 350px;
        height: fit-content;
        border: 1px solid white;
    }

    section > header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 10px;
    }

    section > header > h1 {
        color: white;
        padding: 0;
        font-size: 500;
        font-size: 1.125rem; /* 18px */
        line-height: 1.75rem; /* 28px */
        margin: 10px 0;
    }

    section > header > button {
        color: #ff0000;
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

    section > textarea {
        display: block;
        color: white;
        outline: none;
        background: none;
        border: none;
        width: 95%;
        height: 200px;
        border-bottom: 3px solid gray;
        margin: 5px 10px;
        padding: 0;
        padding-bottom: 5px;
    }

    section > button {
        display: block;
        color: #00ff88;
        outline: none;
        border: 1px solid #00ff88;
        border-radius: 2px;
        background: none;
        align-items: center;
        font-weight: 600;
        margin: 10px 10px 10px auto;
        padding: 7px 1rem;
        width: fit-content;
        height: fit-content;
    }
</style>