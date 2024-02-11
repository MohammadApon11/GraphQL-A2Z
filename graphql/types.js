const {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLError,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLScalarType,
} = require("graphql");
const { users, posts } = require("../data");

// enum type of gender
const GenderType = new GraphQLEnumType({
  name: "GraphQLEnumType",
  description: "Enum type for gender",
  values: {
    male: {
      value: "male",
    },
    female: {
      value: "female",
    },
    others: {
      value: "others",
    },
    flag: {
      value: "flag",
    },
  },
});

// user type
const UserType = new GraphQLObjectType({
  name: "User",
  description: "It Represents a single user",
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    firstName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    lastName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    gender: {
      type: GenderType,
    },
    phone: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: GraphQLString,
    },
    result: {
      type: GraphQLInt,
    },
    // nested query
    posts: {
      type: new GraphQLList(PostType),
      resolve: (user) => {
        return posts.filter((post) => {
          if (user.posts.includes(post.id)) {
            return true;
          }
        });
      },
    },
  }),
});

// posts type
const PostType = new GraphQLObjectType({
  name: "Posts",
  description: "it represent single post",
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    title: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    user: {
      type: UserType,
      resolve: (post, args) => {
        return users.find((user) => user.id === post.user);
      },
    },
  }),
});

// Root Query Type
const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    users: {
      type: new GraphQLList(new GraphQLNonNull(UserType)),
      resolve: () => {
        return users;
      },
    },
    user: {
      type: UserType,
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve: (_, { id }) => {
        const user = users.find((user) => parseInt(user.id) === parseInt(id));
        return user;
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: () => {
        return posts;
      },
    },
    post: {
      type: PostType,
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve: (_, { id }) => {
        const post = posts.find((post) => parseInt(post.id) === parseInt(id));
        return post;
      },
    },
  }),
});

module.exports = {
  RootQueryType,
  UserType,
};
