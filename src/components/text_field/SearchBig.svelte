<script>
    export let placeholder, value, disabled = false;
</script>

<div>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="19" height="19"><path d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="42" d="M338.29 338.29L448 448"/></svg>
    <input
        type="text"
        { placeholder }
        bind:value={ value }
        on:keydown
        { disabled }>
</div>

<style>
    div {
        display: flex;
        background-color: #FFFBF1;
        border-radius: 38px;
        height: 48px;
        margin: 0 1.25rem;
        padding: 0 1rem;
        box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.08);
    }

    div > svg {
        height: 100%;
    }

    div > input {
        outline: none;
        background-color: transparent;
        border: none;
        width: 100%;
        height: 100%;
        margin: auto 0 auto 13px;
    }

    div > input::placeholder {
        opacity: 50%;
    }
</style>