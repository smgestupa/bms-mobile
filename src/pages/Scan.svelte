<script>
    import { Network } from "@capacitor/network";
    import { Camera, CameraResultType } from '@capacitor/camera';
    import { router } from "tinro";
    import { get } from "svelte/store";
    import { decode } from "base64-arraybuffer";
    import { jwtToken } from "$lib/jwtToken.js";
    import toast from "svelte-french-toast";
    import Spinner from "$components/loading/Spinner.svelte";
    let type, token, currImage = "", isFetching = false;

    const jwt = JSON.parse( get( jwtToken ) );
    type = jwt.type;
    token = jwt.token;

    const uploadPhoto = async () => {
        const image = await Camera.getPhoto( { 
            quality: 100,
            allowEditing: true,
            resultType: CameraResultType.Base64
        } );
        currImage = image.base64String ?? "";
    }

    const convertToBlob = () => {
        const blob = new Blob( [ new Uint8Array( decode( currImage ) ) ], {
            type: `image/jpg`
        } );

        return blob;
    }

    const scanPhoto = async () => {
        if ( !( await Network.getStatus() ).connected ) {
            toast.error( "No internet connection detected, try again later", {
                position: "bottom-center"
            } );

            return;
        }

        const formData = new FormData();
        formData.append( "image", convertToBlob() );

        isFetching = true;

        const req = await fetch( "http://[REPLACE WITH SPRING BOOT HOST]:8080/api/v1/books/recognize", {
            method: "post",
            headers: {
                "Accept": "application/json",
                "Authorization": `${ type } ${ token }`
            },
            body: formData
        } );
        const res = await req.json();

        isFetching = false;

        if ( req.status !== 200 ) {
            toast.success( `${ res.message }`, {
                    style: "text-align: center",
                    position: "bottom-center"
                } );
            return;
        }

        router.goto( `/book/${ res.message}` )
        toast.success( "The book has been found", {
                    position: "bottom-center"
                } );
    }
</script>

<div id="page">
    <h1 id="page-title">Scan</h1>
    <figure>
        { #if currImage === "" }
            <img src="/barcode-placeholder.png" alt="Barcode Placeholder">
        { :else }
            <img src="data:image/png;base64,{ currImage }" alt="User Upload">
        { /if }
    </figure>
    <p>The ISBN will be automatically detected when after uploading or using an existing photo, assuming the photo is clear.</p>
    <button on:click={ uploadPhoto }>Upload a photo</button>
    <button on:click={ scanPhoto } 
        disabled={ currImage === "" || isFetching }>
        { #if isFetching }
            <Spinner />
        { :else }
            Scan for ISBN
        { /if }
    </button>
</div>

<style>
    #page {
        background-color: #2f2f2f;
        height: 100%;
        overflow-y: scroll;
    }

    #page-title {
        color: #A7A7A7 !important;
        top: 0;
        margin: 0 0 1rem 0;
        padding: 1.75rem 1rem 0 1rem !important;
        font-weight: 700 !important;
        font-size: 1.125rem; /* 18px */
        line-height: 1.75rem; /* 28px */
    }

    #page > figure {
        background-color: white;
        border-radius: 4px;
        margin: 0;
        padding: 0;
        width: 311px;
        height: 266px;
        margin: 0 auto;
    }

    #page > figure > img {
        object-fit: fit;
        width: 100%;
        height: 100%;
    }

    #page > p {
        color: white;
        text-align: center;
        margin: 13px 0;
        padding: 1.75rem 1rem 0 1rem !important;
        font-size: 0.875rem; /* 14px */
        line-height: 1.25rem; /* 20px */
    }

    #page > button {
        display: block;
        color: white;
        outline: none;
        border: none;
        background-color: #E9A93ADE;
        width: 225px;
        height: 45px;
        border-radius: 8px;
        margin: 2rem auto;
        font-weight: 600px;
        font-size: 1.125rem; /* 18px */
        line-height: 1.75rem; /* 28px */
    }

    #page > button:disabled {
        background-color: gray;
    }
</style>