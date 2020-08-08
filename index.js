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
        const hospitalcollection = myDB.collection('hospitaltable')   /// table for storing data on each hospital


/*       //  for deleting all records
        hospitalcollection.remove({},(err,result)=>{
            if (err) {
                console.log(err);
            }
            else{
            console.log(result);
            console.log("Deleted all records !!!")
            }
            
        })
*/


        
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

            console.log("checking all registered hospitals...")

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



        // to delete a hospital
        app.post("/delete",(req,res)=>{

            console.log("attempting delete request...")

            const query = {
                name:req.body.name                
            }

            console.log(query)            

            //  seraching by the name and then deleting
            hospitalcollection.deleteOne(query,(err,coll)=>{
                if(err){
                    throw err
                }
                else{
                    if(coll.result.n==0){
                        console.log("no such hospital present")
                        res.status(400).send()
                    }
                    else{
                        console.log(coll)   
                        res.status(200).send()
                    }
                }
            })

        })




        //to update the number of beds in a hospital
        app.put("/updatehospital",(req,res)=>{
            
            console.log("attemping put request...")

            const details = {
                name:req.body.name,
                numberofbeds:req.body.number
            }

            console.log(details)

            const query = {
                name:details.name
            }

            const updatedvalue = {
                $set:{
                numberOfBeds:details.numberofbeds
                }
            }            

            //  seraching by the name and then updating the number of hospital beds in use
            hospitalcollection.findOneAndUpdate(query,updatedvalue,{new:true},(err,result)=>{
                if(err){
                    throw err
                }
                else{
                   /// result is null only if the hospital does not exist
                   if(result.lastErrorObject.updatedExisting==false){
                    console.log("No such hospital is registered")
                    res.status(400).send()
                   }
                   else{
                    console.log(result)   
                    res.status(200).send()
                   }
                }
            })
        }) 

        }
        
    }) 
        
   

app.listen(port,()=>{
    console.log("Listening on port:"+port)
})


