// Vercel serverless entry point. All requests get routed here (see
// vercel.json's rewrite rule), and Express's own routing inside index.js
// takes it from there — the whole app runs as one serverless function.
module.exports = require("../index.js");
