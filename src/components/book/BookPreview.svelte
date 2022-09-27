<script>
    export let book;
</script>

<a id="preview" 
    href="/book/{ book.bookID }">
    { #if book.cover }
        <img 
            src="data:image/png;base64,{ book.cover }" 
            alt="Default Cover">
    { :else }
        <img 
            src="/logo-white-bg.png" 
            alt="Default Cover">
    { /if }
    <section>
        <h1>{ book.title ?? "No proper title found" }</h1>
        <h2>{ book.author ? `By ${ book.author }` : "No author found" }</h2>
    </section>
</a>

<style>
    #preview {
        display: block;
        background-color: #F5EFE1;
        outline: none;
        border: none;
        border-radius: 12px;
        width: 175px;
        height: 275px;
        padding: 5px;
        text-decoration: none;
    }

    #preview > img {
        display: block;
        border-radius: 8px;
        width: 100%;
        height: 225px;
        border: 1px solid white;
        object-fit: cover;
    }

    #preview > section {
        display: flex;
        flex-direction: column;
        align-items: start;
        padding: 0 5px;
        margin-top: 2px;
    }

    #preview > section > h1, h2 {
        margin: 0;
        padding: 0;
    }

    #preview > section > h1 {
        color: #2F2F2F;
        font-size: 1rem; /* 16px */
        line-height: 1.5rem; /* 24px */
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
    }

    #preview > section > h2 {
        color: #858585;
        font-size: 0.75rem; /* 12px */
        line-height: 1rem; /* 16px */
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
    }
</style>