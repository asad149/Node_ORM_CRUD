// Importing Dependecies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const typeorm = require("typeorm"); // import * as typeorm from "typeorm";
const Post = require("./model/Post").Post; // import {Post} from "./model/Post";
const Category = require("./model/Category").Category; // import {Category} from "./model/Category";

// App config
const app = express();
const port = process.env.PORT || 3000;

// middlewares
app.use(bodyParser.json());
app.use(cors());

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Users API",
      description: "User API Information",
      contact: {
        name: "Amazing Developer",
      },
      servers: ["http://localhost:9000"],
    },
  },
  apis: ["server.js"],
};

/**
 * @swagger
 * /users:
 *  get:
 *    description: Use to request all customers
 *    responses:
 *      '200':
 *        description: A successful response
 */

/**
 * @swagger
 * /users/{user_id}:
 *  get:
 *   summary: get user by ID
 *   description: create team
 *   parameters:
 *    - in: path
 *      name: user_id
 *      schema:
 *       type: integer
 *      required: true
 *      description: id of the team
 *      example: 2
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * /users:
 *  post:
 *   summary: Insert User Record
 *   description: create user assignment
 *   parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: user assignment of the team
 *   requestBody:
 *    content:
 *     application/json:
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description: error
 */

/**
 * @swagger
 * /users/{user_id}:
 *  put:
 *   summary: Update User Record
 *   description: Update user assignment
 *   parameters:
 *    - in: path
 *      name: user_id
 *      schema:
 *       type: integer
 *      required: true
 *      description: id of the user
 *    - in: body
 *      name: body
 *      required: true
 *      description: user assignment of the team
 *   requestBody:
 *    content:
 *     application/json:
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description: error
 */

/**
 * @swagger
 * /users/{user_id}:
 *  delete:
 *   summary: delete user
 *   description: delete user
 *   parameters:
 *    - in: path
 *      name: user_id
 *      schema:
 *       type: integer
 *      required: true
 *      description: id of the user
 *      example: 2
 *   responses:
 *    200:
 *     description: success
 */

// typeorm
//   .createConnection({
//     type: "mssql",
//     host: "DESKTOP-RP0OT34",
//     port: 1433,
//     username: "hello",
//     password: "abc123",
//     database: "test",
//     synchronize: true,
//     logging: false,
//     entities: [
//       require("./entity/PostSchema"),
//       require("./entity/CategorySchema"),
//     ],
//   })
//   .then(function (connection) {
//     const category1 = new Category(0, "TypeScript");
//     const category2 = new Category(1, "Programming");

//     return connection.manager.save([category1, category2]).then(() => {
//       let post = new Post();
//       post.title = "Control flow based type analysis";
//       post.text =
//         "TypeScript 2.0 implements a control flow-based type analysis for local variables and parameters.";
//       post.categories = [category1, category2];

//       let postRepository = connection.getRepository(Post);
//       postRepository
//         .save(post)
//         .then(function (savedPost) {
//           console.log("Post has been saved: ", savedPost);
//           console.log("Now lets load all posts: ");

//           return postRepository.find();
//         })
//         .then(function (allPosts) {
//           console.log("All posts: ", allPosts);
//         });
//     });
//   })
//   .catch(function (error) {
//     console.log("Error: ", error);
//   });

// create typeorm connection

typeorm
  .createConnection({
    type: "mssql",
    host: "DESKTOP-RP0OT34",
    port: 1433,
    username: "hello",
    password: "abc123",
    database: "test",
    synchronize: true,
    logging: false,
    entities: [
      require("./entity/PostSchema"),
      require("./entity/CategorySchema"),
    ],
  })
  .then((connection) => {
    const userRepository = connection.getRepository(Post);

    // create and setup express app
    const app = express();
    app.use(express.json());

    // register routes

    app.get("/users", async function (req, res) {
      const users = await userRepository.find();
      res.json(users);
    });

    app.get("/users/:id", async function (req, res) {
      const results = await userRepository.findOne(req.params.id);
      return res.send(results);
    });

    app.post("/users", async function (req, res) {
      const user = await userRepository.create(req.body);
      const results = await userRepository.save(user);
      return res.send(results);
    });

    app.put("/users/:id", async function (req, res) {
      const user = await userRepository.findOne(req.params.id);
      userRepository.merge(user, req.body);
      const results = await userRepository.save(user);
      return res.send(results);
    });

    app.delete("/users/:id", async function (req, res) {
      const results = await userRepository.delete(req.params.id);
      return res.send(results);
    });

    // start express server

    const swaggerDocs = swaggerJsDoc(swaggerOptions);

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    app.listen(9000);
  });

// Listen
app.listen(port, () => console.log(`App is running on port ${port}`));
