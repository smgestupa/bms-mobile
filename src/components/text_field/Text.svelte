<script>
    export let placeholder, maxlength = 120, value = "";
</script>

<input 
    class="input-field__login"
    type="text"
    { placeholder }
    { maxlength }
    bind:value={ value } />

<style>
    .input-field__login {
        outline: none;
        display: block;
        background-color: white;
        color: #3C3C43; 
        border: none;
        border-radius: 5px;
        width: 100%;
        height: 100%;
        margin: 0 auto;
        padding: 0 1rem;
        font-size: 0.875rem; /* 14px */
        line-height: 1.25rem; /* 20px */
    }

    .input-field__login::placeholder{
        color: #3C3C43;
        opacity: 50%;
    } 
</style>