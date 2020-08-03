const express = require('express')
const app = express()
const mongoClient = require('mongodb')


const port = 3300
const url = "mongodb://localhost:27017"


const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}



// enabling JSON parsing
app.use(express.json())



// for connecting with the mongo client to use the mongo database
mongoClient.connect(url/*,options*/,(err,db)=>{     //  db refers to mongo client

        if(err){
            console.log(err.errmsg)
        }     
        else{

        console.log("connected !!!")    


        const myDB = db.db('myDB')
        const collection = myDB.collection('myTable')

        app.post('/signup',(req,res)=>{

            console.log("Recieved new user "+req.body)
            
            const newUser = {
                name:req.body.name,
                email:req.body.email,
                password:req.body.password
            }

            const query = {email:newUser.email}

            //  to check if email is unique
            collection.findOne(query,(err,result)=>{

                // result is 'null' only if no other objects have the same email
                if(result==null){
                    collection.insertOne(newUser,(err,result)=>{

                        console.log("User has been added")
                        
                        // sending a status response of 200 to client
                        res.status(200).send()
                    })
                }else{

                    console.log("User already exists")

                    // sending a status response of 400 to client (i.e bad request)
                    res.status(400).send()
                }

            })

        })


        app.post('/login',(req,res)=>{

            const query = {
                email:req.body.email,
                password:req.body.password
            }

            // checking if any object which has same email or password
            collection.findOne(query,(err,result)=>{

                // user exists with same email and password
                if(result!=null){

                    console.log("Logged in as "+result.body)

                    const objToSend = {
                        name:result.name,
                        email:result.email
                    }

                    res.status(200).send(JSON.stringify(objToSend))

                }
                else{   // no user exists with the same email and password

                    console.log("No such user exists....")

                    res.status(404).send();
                }
            })
        })
        }
    }) 
        
   

app.listen(port,()=>{
    console.log("Listening on port:"+port)
})


