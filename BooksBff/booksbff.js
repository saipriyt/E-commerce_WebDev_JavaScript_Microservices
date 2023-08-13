const express = require('express');
const axios = require('axios');
const router = express.Router();
const jwt = require('./validjwt');

//Creating a book
router.post('/books', jwt, async(req,res)=>{

    const book = req.body;

    //checking user-agent presence
    const userAgent = req.headers['user-agent'];

    if(!userAgent){
        return res.status(400).json({message: 'user-agent header is not present'});
    }
    //fetching the data
    await axios.post(`http://34.237.107.100:3000/books`, book)
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

//retrieving a book
router.get(['/books/isbn/:ISBN' , '/books/:ISBN'], jwt, async(req,res) => {

    const ISBN = req.params.ISBN;

    //checking user-agent presence
    const userAgent = req.headers['user-agent'];

    if(!userAgent){
        return res.status(400).json({message: 'user-agent header is not present'});
    }
    
    await axios.get(`http://34.237.107.100:3000/books/isbn/${ISBN}`)
    .then((response) => {
        updatedResponse = response;
        //Checking if user-agent is mobile
        if(userAgent.indexOf('Mobile')>=0) {
            //Updating genre = 3, if it is non-fiction
            if(updatedResponse.data.genre === "non-fiction") {
                updatedResponse.data.genre = 3;
                return res.status(response.status).json(updatedResponse.data);
            }
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

//updating a book
router.put('/books/:ISBN', jwt, async (req, res) => {
    const book = req.body;
    const ISBN = req.params.ISBN;

    //checking user-agent presence
    const userAgent = req.headers['user-agent'];

    if(!userAgent){
        return res.status(400).json({message: 'user-agent header is not present'});
    }

    await axios.put(`http://34.237.107.100:3000/books/${ISBN}`, book)
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

module.exports = router;