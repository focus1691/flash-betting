This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm run server`

This script **only** starts the server, which is responsible for handling all client requests.
Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

* Does not reload for changes made.
* No proxying required.
* Runs on port 3001.
* Edit `NODE_ENV` to run in development or production.

### `npm run dev`

Turns on the server and starts react concurrently.
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

* Port is proxied to 3001: [http://localhost:3001](http://localhost:3001).
* The page will reload if you make edits.
* You will also see any lint errors in the console.
* Edit `NODE_ENV` to run in development or production.

### `npm test`

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run electron-build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

And then uses the build to construct .exe and .dmg installers in a 'dist' folder.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
