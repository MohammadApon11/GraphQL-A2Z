const users = [
  {
    id: 1,
    firstName: "Mohammad",
    lastName: "Apon",
    gender: "male",
    phone: "01881105726",
    result: 4,
    email: "apon@gmail.com",
    posts: [1, 2],
    createdAt: "2024-02-13T06:06:25.371Z",
  },
  {
    id: 2,
    firstName: "Rudro",
    lastName: "Apon",
    gender: "male",
    phone: "01640324752",
    result: 3,
    email: "apon@gmail.com",
    posts: [3],
    createdAt: "2024-02-13T06:06:25.371Z",
  },
  {
    id: 3,
    firstName: "Ajij",
    lastName: "Mulla",
    gender: "flag",
    phone: "01640324752",
    email: "apon@gmail.com",
    result: 2,
    posts: [4],
    createdAt: "2024-05-13T06:06:25.371Z",
  },
];

const posts = [
  {
    id: 1,
    title: "GraphQL",
    description: "SA query language for your api",
    user: 1,
  },
  {
    id: 2,
    title: "Row Js",
    description: "SA query language for your api",
    user: 1,
  },
  {
    id: 3,
    title: "Row Js",
    description: "SA query language for your api",
    user: 2,
  },
  {
    id: 4,
    title: "Row Js",
    description: "SA query language for your api",
    user: 3,
  },
];

module.exports = { users, posts };
