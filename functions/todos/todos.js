const { ApolloServer, gql } = require('apollo-server-lambda');
const faunadb = require('faunadb'),
  q = faunadb.query;

  const dotenv = require('dotenv')
  dotenv.config();

const typeDefs = gql`
  type Query {
    todo: [Todo!]
  }
  type Todo {
    title: String!
    id: ID!
  }
  type Mutation{
    addTodo(title: String!) : Todo
    removeTodo(id: ID!): Todo
    removeAllTodos(id: ID): Todo
  }
`

const resolvers = {
  Query: {
    todo: async(root, args, context) => {
      try{
        var client = new faunadb.Client({ secret: process.env.GATSBY_FAUNADB_SECRET });
        var result = await client.query(  
          q.Map(
            q.Paginate(q.Match(q.Index("all_todos"))),
            q.Lambda(x => q.Get(x))
          )
        )
        return result.data.map(d => {
          return{
            title: d.data.title,
            id: d.ref.id,
          }
        });
      }
      catch(error){
        console.log(error);
      }
    },
  },
  Mutation: {
    addTodo: async (_, {title}) => {
      var client = new faunadb.Client({ secret: process.env.GATSBY_FAUNADB_SECRET })
      try {
        var result = await client.query(
          q.Create(
            q.Collection('todos'),
            { data: { 
              title
             } },
          )
        );
        console.log("Document Created and Inserted in Container: " + result.ref.id);
        return result.ref.data;
      } 
      catch (error){
          console.log('Error: ');
          console.log(error);
      }
      
    },
    removeTodo: async (_, {id}) => {

      console.log(id)
      try {
        var client = new faunadb.Client({ secret: process.env.GATSBY_FAUNADB_SECRET });
        var result = await client.query(

          q.Delete(q.Ref(q.Collection("todos"), id))

        );
        // return result.ref.data

      } 
      catch (error){
          console.log('Error: ');
          console.log(error);
      }
    },

    removeAllTodos: async() => {
      var client = new faunadb.Client({ secret: process.env.GATSBY_FAUNADB_SECRET })
      try {
        var result = await client.query(
          q.Map(
            q.Paginate(q.Match(q.Index("all_todos"))),
            q.Lambda((x) => q.Delete(x))
          )
        );
          }
       catch (error){
         console.log('Error: ');
        console.log(error);
        }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = server.createHandler()

module.exports = { handler }
