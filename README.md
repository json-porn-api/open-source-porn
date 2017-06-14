# Open Source Porn

Work in progress. Go away.

## Run Locally

1.  [Setup your environment for Node.js developement][nodejs_dev].
1.  [Install the Google Cloud SDK][sdk].
1.  Acquire local credentials for authenticating with Google Cloud Platform APIs:

        gcloud auth application-default login

1.  Install depedencies using `npm` or `yarn`:

        npm install

    or

        yarn install

1.  Run the sample with `npm` or `yarn`:

        npm start

    or

        yarn start

1.  Visit the application at [http://localhost:8080](http://localhost:8080).

## Deploy

1.  Use the [Google Cloud Console][console] to create a Google Cloud Platform project.
1.  [Enable billing][billing] for your project.

1.  Use the Cloud SDK to deploy your app.

        gcloud app deploy

    Note: If there is a `yarn.lock` file then `yarn install` will be used during
    deployment. Delete the `yarn.lock` file to fall back to `npm install`.

1.  View your deployed application at `https://YOUR_PROJECT_ID.appspot.com`.


[nodejs]: https://nodejs.org/
[appengine]: https://cloud.google.com/appengine/docs/flexible/nodejs/
[nodejs_dev]: https://cloud.google.com/community/tutorials/how-to-prepare-a-nodejs-dev-environment
[sdk]: https://cloud.google.com/sdk/
[console]: https://console.cloud.google.com
[billing]: https://support.google.com/cloud/answer/6293499#enable-billing