<script>
    import { Preferences } from "@capacitor/preferences";
    import { Network } from "@capacitor/network";
    import { Camera, CameraResultType } from '@capacitor/camera';
    import { get } from "svelte/store";
    import { jwtToken } from "../lib/jwtToken.js";
    import toast from "svelte-french-toast";
    import UpdateDescription from "../components/text_area/UpdateDescription.svelte";
    let userCode, firstName, lastName, photo, bio, openEditor = false;

    const jwt = JSON.parse( get( jwtToken ) );
    userCode = jwt.userCode;
    firstName = jwt.firstName;
    lastName = jwt.lastName;
    photo = jwt.photo;
    bio = jwt.bio;

    const updateProfile = async () => {
        const values = JSON.parse( ( await Preferences.get( { key: "jwt" } ) ).value );
        photo = values.photo;
        bio = values.bio;
    }

    const updatePhoto = async () => {
        if ( !( await Network.getStatus() ).connected ) {
            toast.error( "No internet connection detected, try again later", {
                position: "bottom-center"
            } );
            return;
        }

        const image = await Camera.getPhoto( { 
            quality: 90,
            allowEditing: true,
            resultType: CameraResultType.Base64
        } );

        const details = JSON.parse( ( await Preferences.get( { key: "jwt" } ) ).value );
        details.photo = image.base64String;

        fetch( "http://[REPLACE WITH SPRING BOOT HOST]:8080/api/v1/user/update", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `${ details.type } ${ details.token }`
            },
            body: JSON.stringify( {
                userCode,
                photo: details.photo,
                bio: null
            } ) } )
            .then( async res => {
                if ( res.status !== 200 ) throw( "" ); 
                
                await Preferences.set( { 
                    key: "jwt",
                    value: JSON.stringify( details )
                } );

                $jwtToken = JSON.stringify( details );

                updateProfile();

                toast.success( "Successfully updated the profile picture", {
                    position: "bottom-center"
                } );
            } )
            .catch( e => {
                toast.error( "Something went wrong with updating the photo", {
                    position: "bottom-center"
                } );
            } );
    }
</script>

{ #if openEditor }
    <UpdateDescription bind:openEditor={ openEditor } { bio } { updateProfile } />
{ /if }

<div id="page">
    <div id="page-title">
        <h1>Profile</h1>
    </div>
    <header>
        <figure>
            { #if photo }
                <img 
                    src="data:image/png;base64,{ photo }" 
                    alt="User"
                    width="102"
                    height="102">
            { :else }
                <img 
                    src="/blank-picture.jpg" 
                    alt="User"
                    width="102"
                    height="102">
            { /if }
            <button on:click={ updatePhoto }>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="28" height="28"><path d="M384 224v184a40 40 0 01-40 40H104a40 40 0 01-40-40V168a40 40 0 0140-40h167.48" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path d="M459.94 53.25a16.06 16.06 0 00-23.22-.56L424.35 65a8 8 0 000 11.31l11.34 11.32a8 8 0 0011.34 0l12.06-12c6.1-6.09 6.67-16.01.85-22.38zM399.34 90L218.82 270.2a9 9 0 00-2.31 3.93L208.16 299a3.91 3.91 0 004.86 4.86l24.85-8.35a9 9 0 003.93-2.31L422 112.66a9 9 0 000-12.66l-9.95-10a9 9 0 00-12.71 0z"/></svg>
            </button>
        </figure>
        <!-- first & last name -->
        <h1>{ firstName ?? "Undefined" } { lastName ?? "Undefined" }</h1>
        <!-- user code -->
        <h2>#{ userCode ?? "0000000" }</h2>
    </header>
    <section id="about">
        <header>
            <h1>
                About the user
                <button on:click={ () => openEditor = !openEditor }>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="21" height="21"><path d="M384 224v184a40 40 0 01-40 40H104a40 40 0 01-40-40V168a40 40 0 0140-40h167.48" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path d="M459.94 53.25a16.06 16.06 0 00-23.22-.56L424.35 65a8 8 0 000 11.31l11.34 11.32a8 8 0 0011.34 0l12.06-12c6.1-6.09 6.67-16.01.85-22.38zM399.34 90L218.82 270.2a9 9 0 00-2.31 3.93L208.16 299a3.91 3.91 0 004.86 4.86l24.85-8.35a9 9 0 003.93-2.31L422 112.66a9 9 0 000-12.66l-9.95-10a9 9 0 00-12.71 0z"/></svg>
                </button>
            </h1>
        </header>
        <p>{ bio ?? "This user does not have a bio of themselves." }</p>
    </section>
</div>

<style>
    #page {
        background-color: #2f2f2f;
        height: 100%;
        overflow-y: scroll;
    }

    #page-title {
        color: #A7A7A7 !important;
        position: absolute;
        top: 0;
        margin: 0;
        margin: 0 0 1rem 0;
        padding: 16px 1rem 0 1rem !important;
    }

    #page-title > h1 {
        font-weight: 700 !important;
        font-size: 1.125rem; /* 18px */
        line-height: 1.75rem; /* 28px */
    }

    #page > header {
        background-color: #343a40;
        height: fit-content;
        padding: 2.5rem 0;
    }

    #page > header > figure {
        position: relative;
        fill: white;
        width: fit-content;
        height: fit-content;
        margin: 1rem auto;
    }

    #page > header > figure > img {
        border-radius: 99px;
    }

    #page > header > figure > button {
        top: 0;
        right: 0;
        position: absolute;
        outline: none;
        background: none;
        border: none;
        stroke: black;
    }

    #page > header > figure > button > svg {
        filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.06));
    }

    #page > header > h1, h2 {
        color: white;
        text-align: center;
        font-weight: 400;
        margin: 5px 0;
        padding: 0;
    }

    #page > header > h2 {
        color: #A7A7A7;
        font-size: 1.125rem; /* 18px */
        line-height: 1.75rem; /* 28px */
    }

    #about {
        margin: 0 1rem;
    }

    #about > header > h1 {
        display: flex;
        color: white;
        fill: white;
        margin: 1rem 0 10px 0;
        padding: 0;
    }

    #about > header > h1 > button {
        outline: none;
        background: none;
        border: none;
        margin-left: 8px;
    }

    #about > p {
        text-justify: inter-word;
        color: white;
        width: fit-content;
        width: 100%;
        margin: 0;
        padding: 0;
        font-size: 0.875rem; /* 14px */
        line-height: 1.25rem; /* 20px */
        overflow-wrap: break-word;
    }
</style>