<script>
    import { active } from "tinro";
</script>

<nav>
    <ul>
        <li>
            <a href="/dashboard" use:active data-exact>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24"><path d="M80 212v236a16 16 0 0016 16h96V328a24 24 0 0124-24h80a24 24 0 0124 24v136h96a16 16 0 0016-16V212" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path d="M480 256L266.89 52c-5-5.28-16.69-5.34-21.78 0L32 256M400 179V64h-48v69" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
                <!-- will show if selected -->
                <svg xmlns="http://www.w3.org/2000/svg" class="nav__circle" viewBox="0 0 512 512" width="8" height="8"><path d="M256 464c-114.69 0-208-93.31-208-208S141.31 48 256 48s208 93.31 208 208-93.31 208-208 208z"/></svg>
            </a>
        </li>
        <li>
            <a href="/dashboard/scan" use:active data-exact>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24"><path d="M342 444h46a56 56 0 0056-56v-46M444 170v-46a56 56 0 00-56-56h-46M170 444h-46a56 56 0 01-56-56v-46M68 170v-46a56 56 0 0156-56h46" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="44"/></svg>
                <!-- will show if selected -->
                <svg xmlns="http://www.w3.org/2000/svg" class="nav__circle" viewBox="0 0 512 512" width="8" height="8"><path d="M256 464c-114.69 0-208-93.31-208-208S141.31 48 256 48s208 93.31 208 208-93.31 208-208 208z"/></svg>
            </a>
        </li>
        <li>
            <a href="/dashboard/profile" use:active data-exact>
                <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512" width="24" height="24"><path d="M332.64 64.58C313.18 43.57 286 32 256 32c-30.16 0-57.43 11.5-76.8 32.38-19.58 21.11-29.12 49.8-26.88 80.78C156.76 206.28 203.27 256 256 256s99.16-49.71 103.67-110.82c2.27-30.7-7.33-59.33-27.03-80.6zM432 480H80a31 31 0 01-24.2-11.13c-6.5-7.77-9.12-18.38-7.18-29.11C57.06 392.94 83.4 353.61 124.8 326c36.78-24.51 83.37-38 131.2-38s94.42 13.5 131.2 38c41.4 27.6 67.74 66.93 76.18 113.75 1.94 10.73-.68 21.34-7.18 29.11A31 31 0 01432 480z"/></svg>
                <!-- will show if selected -->
                <svg xmlns="http://www.w3.org/2000/svg" class="nav__circle" viewBox="0 0 512 512" width="8" height="8"><path d="M256 464c-114.69 0-208-93.31-208-208S141.31 48 256 48s208 93.31 208 208-93.31 208-208 208z"/></svg>
            </a>
        </li>
    </ul>
</nav>

<style>
    nav {
        background-color: #FBF8F2;
        height: 64px;
    }

    nav > ul {
        display: flex;
        justify-content: space-evenly;
        height: 100%;
        margin: 0;
        padding: 0;
    }

    nav > ul > li {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    nav > ul > li > a {
        outline: none;
        position: relative;
        color: #2F2F2F;
        border: none;
        outline: none;
        background: none;
        text-align: center;
        height: fit-content;
        text-decoration: none;
        -webkit-tap-highlight-color: transparent;
    }

    .nav__circle {
        position: absolute;
        opacity: 0%;
        fill: #BFA054;
        left: 0;
        right: 0;
        bottom: 0;
        transform: translateY( 10px );
        margin: 0 auto;
        transition-duration: 300ms;
    }

    :global( .active ) > .nav__circle {
        opacity: 100% !important;
    }
</style>