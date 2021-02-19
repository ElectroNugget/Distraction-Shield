# Aiki 3.0

## General Information

Aiki is a browser extension designed to take advantage of our human nature. 
It is a very common scenario to find ourselves browsing sites such as Facebook or Reddit while we are supposed to be working. 
Aiki can help you to do something useful and enriching; a distraction 'Aikido'. 

The main functionality of Aiki extension is to detect when the user navigates to a website that they consider a distraction. 
It then presents a learning exercise instead. Once the user has completed the exercise, they will be free to continue onto the original site. 
The user can choose which sites they would like to be redirected to by adding domain names to a blacklist. 

This new version of Aiki will attempt to add some more functionality to the application while removing the reliance on iframes to deliver learning 
content, which makes it unusable for many learning sites.

## Building

After some time and scary git merges, we have got the `main` branch up and running.

In theory, if you clone the `main` branch, you can build by first running `yarn` and then building the project:

```shell
yarn build
```

The application will then be built under `/build`.

## Running in Chrome

To add it to Chrome, enable developer options in the Chrome `chrome://extensions` page and load the `/build` by hitting the "Load unpacked" button.
