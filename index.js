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
        /*const collection = myDB.collection('table')*/
        const hospitalcollection = myDB.collection('hospitaltable')   /// table for storing data on each hospital



        // for adding a new hospital
        app.post('/newhospital',(req,res)=>{

            console.log("Recieved new hospital "+req.body)

            const newHospital = {
                name:req.body.name,
                numberOfBeds:req.body.numberOfBeds,
                location:req.body.location,
                description:req.body.description                
            }

            console.log(newHospital)
            
            const query = {name:newHospital.name}

            //  to check if hospitalname is unique
            hospitalcollection.findOne(query,(err,result)=>{

                // result is 'null' only if no other hospitals have the same name
                if(result==null){
                    hospitalcollection.insertOne(newHospital,(err,result)=>{

                        console.log("Hospital has been added")
                        
                        // sending a status response of 200 to client
                        res.status(200).send()
                    })
                }else{

                    console.log("Hospital has already been registered")

                    // sending a status response of 400 to client (i.e bad request)
                    res.status(400).send()
                }

            })

        })


        //  to get all registered hospitals
        app.get("/allregisteredhospitals",(req,res)=>{

            console.log("returning all registered hospitals...")

            hospitalcollection.find({}).toArray((err,result)=>{
                if(err){
                    throw err
                }
                else{
                    /// result is null only if there aren't any hospitals
                    if(result==null){
                        console.log("No hospitals registered")
                        res.status(400).send()
                    }
                    else{

                        const returnedvalue = {
                            hospitals:result
                        }

                        console.log("retrieving all registered hospitals")
                        console.log(returnedvalue)
                        res.status(200).send(JSON.stringify(returnedvalue))
                    }
                }
            })

        })










        /// example post requests......
        /*
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

                    console.log("Logged in as "+query)

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
            
        })*/
        }
        
    }) 
        
   

app.listen(port,()=>{
    console.log("Listening on port:"+port)
})


