const express = require('express');
const axios = require('axios');
const router = express.Router();
const jwt = require('./validjwt');

//Add Customer
router.post('/customers', jwt, async(req,res)=>{

    const customer = req.body;

    //checking user-agent presence
    const userAgent = req.headers['user-agent'];

    if(!userAgent){
        return res.status(400).json({message: 'user-agent header is not present'});
    }
    //fetching the data
    await axios.post(`http://34.202.254.207:3000/customers`, customer)
    .then((response) => {
        return res.status(response.status).json(response.data);
    })
    .catch((error) =>{
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        console.error(error);
        return res.status(500).json({message: 'Error fetching the data'});
    });
});

//Retrive Customer by id endpoint
router.get('/customers/:id', jwt, async(req,res) => {

    const id = req.params.id;

    //checking user-agent presence
    const userAgent = req.headers['user-agent'];

    if(!userAgent){
        return res.status(400).json({message: 'user-agent header is not present'});
    }

    await axios.get(`http://34.202.254.207:3000/customers/${id}`)
    .then((response) => {
        updatedResponse = response.data;
        //Checking if user-agent is mobile
        if(userAgent.indexOf('Mobile')>=0) {
            //Updating the structure by removing few key value pairs
            delete updatedResponse.address;
            delete updatedResponse.address2;
            delete updatedResponse.city;
            delete updatedResponse.state;
            delete updatedResponse.zipcode;

            return res.status(response.status).json(updatedResponse)
        };
        return res.status(response.status).json(response.data);
    })

    .catch((error) =>{
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        console.error(error);
        return res.status(500).json({message: 'Error fetching the data'});
    });
});

//Retrive Customer by user id endpoint
router.get(['/customers/'] , jwt, async (req,res,next)=> {

    const userId = req.query.userId;

    //checking user-agent presence
    const userAgent = req.headers['user-agent'];

    if(!userAgent){
        return res.status(400).json({message: 'user-agent header is not present'});
    }

    await axios.get(`http://34.202.254.207:3000/customers?userId=${userId}`)
    .then((response) => {
        updatedResponse = response.data;
        //Checking if user-agent is mobile
        if(userAgent.indexOf('Mobile')>=0) {
            //Updating the structure by removing few key value pairs
            delete updatedResponse.address;
            delete updatedResponse.address2;
            delete updatedResponse.city;
            delete updatedResponse.state;
            delete updatedResponse.zipcode;
            return res.status(response.status).json(updatedResponse)
        };
        return res.status(response.status).json(response.data);
    })
    .catch((error) =>{
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        console.error(error);
        return res.status(500).json({message: 'Error fetching the data'});
    });
});
module.exports = router;