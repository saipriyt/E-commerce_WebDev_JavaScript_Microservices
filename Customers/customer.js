const express = require('express');
const connection = require('./connection');
const router = express.Router();

//Add customer
router.post('/customers',(req,res,next)=>{
    var customer = req.body;

    //Not Null Check
    if(!customer.userId || !customer.name || !customer.phone || !customer.address || !customer.city || !customer.state || !customer.zipcode) {
        return res.status(400).json({message: 'all keys in the request body are mandatory'});
    }

    //State Check
    const stateRegex = /^[A-Z]{2}$/;
    const testState =  stateRegex.test(customer.state);

    if(!testState){
        return res.status(400).json({message: 'state must be a valid 2-letter US state abbreviation'});
    } 

    //Email Check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const testEmail = emailRegex.test(customer.userId);

    if(!testEmail){
        return res.status(400).json({message: 'userId must be a valid email address'});
    }

    const newCustomer = {
        userId: customer.userId,
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        address2: customer.address2,
        city: customer.city,
        state: customer.state,
        zipcode: customer.zipcode
    };

    //Insert book
    connection.query('Select * FROM Customer where userId = ?',[customer.userId], (err,results) => {
        if(results.length>0){
            return res.status(422).json({message: "This user ID already exists in the system."});
        }
        else{
            var query = 'INSERT INTO Customer SET ?';
            connection.query(query,newCustomer, (err, results) => {
                if(err){
                    return res.status(400).json({message:err});
                }
                else {
                    connection.query('Select * FROM Customer ORDER BY id DESC LIMIT 1', (err, result)=> {
                        return res.status(201).json(result[0]);
                    });
                    
                }
            });
        }
    });
    
});

//Retrive Customer by id endpoint
router.get(['/customers/:id'] ,(req,res,next)=> {
    const id = req.params.id;
    var customer = req.body;
    if(isNaN(id)){
        return res.status(400).json({message:'Illegal, missing, or malformed input'});
    }
    connection.query('Select * FROM Customer where id = ?', [id], (err, results)=> {
        if(err){
            res.status(400).json(err);
        }
        else{
        if(results.length == 0) {
            res.status(404);
            res.json({message:'ID does not exist in the system'});
            return res;
        }
        res.status(200).json(results[0]);
    }
    
});
});

//Retrieve Customer by user ID endpoint
router.get(['/customers/'] ,(req,res,next)=> {

    const userId = req.query.userId;

    //Email Check    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const testEmail = emailRegex.test(userId);

    if(!testEmail){
        return res.status(400).json({message: 'userId must be a valid email address'});
    }   
   
    connection.query('Select * FROM Customer where userId = ?', [userId], (err, results)=> {
    if (!err) {
        if(results.length == 0) {
            res.status(404);
            res.json({message:'User-ID does not exist in the system'});
            return res;
        }
        res.status(200).json(results[0]);
    }
    else{
        res.status(400).json(err);
    }
});
});

module.exports = router;