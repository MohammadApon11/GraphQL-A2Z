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
  GraphQLInputObjectType,
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
      type: new GraphQLNonNull(GenderType),
    },
    phone: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
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

// create a input type of user
const UserTypeInput = new GraphQLInputObjectType({
  name: "UserTypeInput",
  description: "It Create a new user",
  fields: () => ({
    firstName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    lastName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    gender: {
      type: new GraphQLNonNull(GenderType),
    },
    phone: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    result: {
      type: GraphQLInt,
    },
  }),
});

// Update a user
const UpdateUserTypeInput = new GraphQLInputObjectType({
  name: "UpdateUserTypeInput",
  description: "It update a existing user",
  fields: () => ({
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
    gender: {
      type: GenderType,
    },
    phone: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    result: {
      type: GraphQLInt,
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

// Root mutation Type
const RootMutationType = new GraphQLObjectType({
  name: "Mutaion",
  description: "It Represent Mutation",
  fields: () => ({
    addUser: {
      type: UserType,
      args: {
        input: {
          type: UserTypeInput,
        },
      },
      resolve: (
        _,
        { input: { firstName, lastName, gender, phone, email, result } }
      ) => {
        const user = {
          id: users.length + 1,
          firstName,
          lastName,
          gender,
          phone,
          email,
          result,
          posts: [],
        };
        users.push(user);
        return user;
      },
    },
    updateUser: {
      type: UserType,
      args: {
        id: {
          type: GraphQLID,
        },
        input: {
          type: UpdateUserTypeInput,
        },
      },
      resolve: (
        _,
        { id, input: { firstName, lastName, gender, phone, email, result } }
      ) => {
        let updatedUser = null;
        users.forEach((user) => {
          if (parseInt(user.id) === parseInt(id)) {
            if (firstName) {
              user.firstName = firstName;
            }
            if (lastName) {
              user.lastName = lastName;
            }
            if (gender) {
              user.gender = gender;
            }
            if (phone) {
              user.phone = phone;
            }
            if (email) {
              user.email = email;
            }
            if (result) {
              user.result = result;
            }
            updatedUser = user;
          }
        });
        return updatedUser;
      },
    },
    deleteUser: {
      type: new GraphQLNonNull(GraphQLBoolean),
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve: (_, { id }) => {
        const index = users.findIndex(
          (user) => parseInt(user.id) === parseInt(id)
        );
        if (index >= 0) {
          users.splice(index, 1);
          return true;
        }
        return false;
      },
    },
  }),
});

module.exports = {
  RootQueryType,
  RootMutationType,
  UserType,
};
