# Binder

A simple one stop solution for managing your word documents on local system and Google Drive. Binder uses [Angular 8.2.0](https://angular.io) and [Electron v6](https://electronjs.org/).

## Running the Project

Run `npm run build` to build the npm front-end. Run `npm run electron` after it to launch the electron application.

## Proxy Server

To keep the Google logic confidential and secure, Binder uses a proxy server to handle all the requests related to Google Drive interaction. The proxy server is confidential and only editted by the author of this project. If you wish to make an API call to the proxy server, raise a request for it.

## File Paths

By default, the Binder project is configured to look for files in the E:/ drive of a windows machine. To configure your own file paths, feel free to modify the `./server/systemPaths.js` file. A feature to configure file paths from the front end is currently under development and will be releaed in future iterations.

## Documentation

You can find the documentation at [Binder Documenation](https://meghansh36.github.io/Binder/). I will be updating the documentation with comments in the upcoming iterations

## Task Lists

Head over to the Project tab of this repository to find active to-do list and raise a request if you wish to contribute.

## Feature Requests

For making a feature request, raise an issue with `enhancement` label.

Happy Coding!!
 
