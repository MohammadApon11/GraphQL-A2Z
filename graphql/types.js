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
  Kind,
} = require("graphql");

const { users, posts } = require("../data");

// cusomt enum type of gender
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

// Date Type
const ValidateDate = (value) => {
  const date = new Date(value);
  if (date.toString() === "Invalid Date") {
    throw new GraphQLError(`${value} is a valid date`);
  } else {
    return date.toLocaleDateString();
  }
};

const DateType = new GraphQLScalarType({
  name: "DateType",
  description: "It Represent a date",
  parseValue: ValidateDate,
  parseLiteral: (AST) => {
    if (AST.kind === Kind.STRING || AST.kind === Kind.INT) {
      return ValidateDate(AST.value);
    } else {
      throw new GraphQLError(`${AST.value} is not a number or string`);
    }
  },
  serialize: ValidateDate,
});

// Email Type
const ValidateEmail = (email) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return email.toLowerCase();
  } else {
    throw new GraphQLError("You have entered an invalid email address!");
  }
};

const EmailType = new GraphQLScalarType({
  name: "EmailType",
  description: "It For Email validation",
  parseValue: ValidateEmail,
  parseLiteral: (AST) => {
    if (AST.kind === Kind.STRING || AST.kind === Kind.INT) {
      return ValidateEmail(AST.value.toLowerCase());
    } else {
      throw new GraphQLError(`${AST.value} is not a valid email`);
    }
  },
  serialize: ValidateEmail,
});

// password type
const validatePassword = (password) => {
  const passwordRegex =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  if (passwordRegex.test(password)) {
    return password;
  } else {
    throw new GraphQLError("Password is not enough strong!");
  }
};

const PasswordType = new GraphQLScalarType({
  name: "PasswordType",
  description: "It For Password validation",
  parseValue: validatePassword,
  parseLiteral: (AST) => {
    if (AST.kind === Kind.STRING) {
      return validatePassword(AST.value);
    } else {
      throw new GraphQLError("Password is not a string");
    }
  },
  serialize: validatePassword,
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
      type: new GraphQLNonNull(EmailType),
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
    createdAt: {
      type: DateType,
    },
    password: {
      type: new GraphQLNonNull(PasswordType),
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
      type: new GraphQLNonNull(EmailType),
    },
    result: {
      type: GraphQLInt,
    },
    createdAt: {
      type: DateType,
    },
    password: {
      type: new GraphQLNonNull(PasswordType),
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
      type: EmailType,
    },
    result: {
      type: GraphQLInt,
    },
    password: {
      type: PasswordType,
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
        {
          input: {
            firstName,
            lastName,
            gender,
            phone,
            email,
            result,
            createdAt,
          },
        }
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
          createdAt,
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
        {
          id,
          input: {
            firstName,
            lastName,
            gender,
            phone,
            email,
            result,
            createdAt,
          },
        }
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
            if (createdAt) {
              user.createdAt = createdAt;
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
