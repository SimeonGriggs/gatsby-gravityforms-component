# Gravity Forms Form Component

A (relatively) plug and play component for parsing [gatsby-source-gravityforms](https://www.npmjs.com/package/gatsby-source-gravityforms) GraphQL data. Outputs a component using BEM classes, meaning all you need to do it style it.

Uses [React Hook Forms](https://react-hook-form.com/) under the hood for all that good state management.

## Installation

```js
# Install the component
yarn add gatsby-gravityforms-component

# Or with NPM
npm i gatsby-gravityforms-component
```

## Using the component

1. Once you have set up [gatsby-source-gravityforms](https://www.npmjs.com/package/gatsby-source-gravityforms)
2. Import the component where you want to use it
3. Grab the GraphQL data from the gatsby-source-gravityforms plugin and pass to component
4. Set the form ID
5. Add your environment variables
6. Add the Lambda function (scroll down a little)

```js
import React from 'react'
import GravityFormForm from 'gatsby-gravityforms-component'

// Would recommend moving this into a separate /src/hooks/gravityforms.js file
// and import where needed
import { useStaticQuery, graphql } from 'gatsby'
const allGravityData = () => {
    const { allGfForm } = useStaticQuery(
        graphql`
            query {
                allGfForm {
                    edges {
                        node {
                            formId
                            slug
                            apiURL
                            descriptionPlacement
                            formFields {
                                id
                                label
                                description
                                descriptionPlacement
                                type
                                choices
                                content
                                errorMessage
                                inputMaskValue
                                isRequired
                                visibility
                                cssClass
                                placeholder
                                size
                                defaultValue
                                maxLength
                            }
                            button {
                                text
                            }
                            confirmations {
                                message
                            }
                        }
                    }
                }
            }
        `
    )
    return allGfForm
}

const examplePage = () => (
    <GravityFormForm
        id={1}
        formData={allGravityData()}
        presetValues={{ input_1: 'special_value' }}
        lambda={process.env.LAMBDA_ENDPOINT}
    />
)
export default examplePage
```

This outputs the form that has been set up in WordPress - Gravity Forms. Ready for you to style it!

id: The ID of the form, get in WordPress Gravity Forms
formDate: The data passed from the query function - this is the same for all forms
presetValues: An object, with the keys set as the input ID (shown in Gravity Forms editor) and the value to set the field as. Great for hidden fields.
lambda: The URL to the lambda endpoint

## Add Environment Variables

The following environment variables should be added to your hosting provider backend. If unsure, most providers have an article explaining. A quick Google should find this.

```js
GF_CONSUMER_KEY = 'XXXXXX'
GF_CONSUMER_SECRET = 'XXXXXX'
LAMBDA_ENDPOINT = 'https://examplesite.com/.netlify/functions/newGfEntry'
```

See "/examples/lambda/.env/sample" for the file.

Depending on what build (Gatsby/React/ect) you are using, these will need to be defined and pulled into your project in different ways.

-   Webpack: https://webpack.js.org/plugins/define-plugin/
-   Gatsby: https://www.gatsbyjs.org/docs/environment-variables/#accessing-environment-variables-in-javascript

## Adding the Lambda (for netlify)

To enable the component to pass data from a static site to a server needs a little big of help to bridge the gap. As Gravity Forms uses secret keys to read/write, there needs to be somewhere safe to hold and manage these details.

Using a combination of environment variables and a Lambda function we can navigate these insecure waters.

Add the following function as a Lambda function, and add your Gravity Form keys as environment variables (these will be already set if you are using the gatsby-source-gravityforms plugin)

1. Add a folder called "lambda" in your projects /src folder
2. Create a file inside called "newGfEntry.js"
3. Copy the code from /examples/lambda/newGfEntry.js into that file
4. Make sure all environment variables at the top of the code have been updated with yours.
5. Add a folder at the root of your project called "built-lambda"
6. Create a file at the root of your project called netlify.toml
7. Add the following code to netlify.toml
8. TODO - add details about deployment

```
[build]
    functions = "built-lambda"

```

If you have any issues with these steps, see these articles:

-   https://www.netlify.com/docs/functions/
-   https://travishorn.com/netlify-lambda-functions-from-scratch-1186f61c659e
-   https://macarthur.me/posts/building-a-lambda-function-with-netlify

### Running on Localhost

If you are running this in a development build on localhost in Chrome, you will come across a Cors issue. No matter what you do, the request will not be read. This is due to Chrome not allowing this.

A solution for a development environment - Run Chrome with the following flag: --disable-web-security

For more information: https://stackoverflow.com/questions/10883211/deadly-cors-when-http-localhost-is-the-origin/10892392#10892392

## Self Signed Certificate Error - SSL

If you are having Self Signed Certificate issues, put this at the top of the newGfEntry.js file.

```
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
```

-   But only on your localhost!!! \*

## Testing & Developing

Firstly, yes please! Any help would be great.

If you are developing locally, you may run into an error "Cannot resolve React". If you do, check out this article: https://thoughtsandstuff.com/building-react-components-for-gatsby-using-npm-link-and-hooks-cant-resolve-react-solution

## To Do

### Field Components

-   [x] Input
-   [x] Textarea
-   [x] Select
-   [ ] Multiselect
-   [x] Number
-   [x] Checkbox
-   [x] Radio
-   [x] Hidden
-   [x] HTML

-   [x] Add masking to inputs

### General Form

-   [ ] Honeypot
-   [ ] Add submit/error callback for custom use

### Send to CMS

-   [ ] Turn data into Gravity Forms schema
-   [ ] Function to send/receive data from CMS
-   [ ] Error handling provided by Gravity Forms
