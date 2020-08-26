'use strict';
const AWS = require("aws-sdk")
AWS.config.update({ region: process.env.REGION || "us-west-2" })

const handler = async event => {
    const result = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: "I'm a stub"
    }

    return result
}

export default handler