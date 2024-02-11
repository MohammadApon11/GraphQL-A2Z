const express = require("express");
const app = express();
const { graphqlHTTP } = require("express-graphql");
const { schema } = require("./graphql/schema");
const port = 5000;

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
