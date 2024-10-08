const { DEVID } = require("../../scripts/keys.js");

exports.handler = async (event) => {
    const DEVKEY = process.env.DEVKEY; // Access your environment variable
    // const DEVID = process.env.DEVID; // Access your environment variable
    return {
      statusCode: 200,
      body: JSON.stringify({ DEVKEY })
    };
  };