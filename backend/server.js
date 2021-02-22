const app=require('./app')
const connectDatabase=require('./config/database')

const dotenv=require('dotenv')

//Handle Uncaught exceptions
process.on('uncaughtException',err=>{
    console.log(`ERROR : ${err.message}`)
    console.log('Shutting down Server due to uncaughtException')
    process.exit(1)
})

//Setting up config file
dotenv.config({path:'backend/config/config.env'})


//Connecting to Database
connectDatabase()

const server= app.listen(process.env.PORT,()=>{
    console.log(`Server listening on port: ${ process.env.PORT } in ${process.env.NODE_ENV} mode`)
})

//Handle unhandled Promise rejections
process.on('unhandledRejection',err=>{
    console.log(`ERROR; ${err.message}`)
    console.log('Shutting down the server due to unhandled Promise rejections')
    server.close(()=>{
        process.exit(1)
    })
})
