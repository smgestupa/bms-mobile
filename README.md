# bms-mobile
The front-end, mobile application of our college project

This uses Svelte for the front-end, and Capacitor to convert it into a mobile application.

## [Screenshots](/screenshots)

## Cloning the Repository
1. Go to your preferred directory
2. Open your terminal and execute `git@github.com:laazyCmd/bms-mobile.git`
3. Open/import the project to your preferred IDE
4. Open a terminal inside the directory and execute `npm install`
5. Run `npm run dev -- --host`
6. Add this on `capacitor.config.json`:
    > You can choose the last two addresses after exposing host
    ```
    "server": {
        "hostname": "http://[REPLACE]:5173",
        "cleartext": true
    }
    ```
7. Do `npm run android:build` then `npm run android:dev`
    > You must have installed an Android Emulator beforehand

## Virtual Device(s) Used
- `Pixel 3 API 30`