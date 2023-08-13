const express = require('express');
const connection = require('./connection');
const router = express.Router();

router.post('/books',(req,res,next)=>{
    var book = req.body;

    //Not Null Check
    if(!book.ISBN || !book.title || !book.Author || !book.description || !book.genre || !book.price || !book.quantity) {
        return res.status(400).json({message: 'all fields in the request body are mandatory'});
    }

    //Decimal Check
    const regexPricePattern = /^\d+(?:\.\d{1,2})?$/; 
    const testPrice =  regexPricePattern.test(book.price);
    if(!testPrice){
        return res.status(400).json({message: 'price must be a valid number with 2 decimal places'});
    } 

    //Insert book
    connection.query('Select * FROM Book Where ISBN = ?', book.ISBN, (err, result) => {
        if(err){
            return res.status(400);
        }
        if (result.length != 0) {
            //If the ISBN already exists
            return res.status(422).json({ message: 'This ISBN already exists in the system.' });
        }
        else {
            //if ISBN does not exist, creating NEW
            res.status(201);
            res.json(book);
            query = "INSERT INTO Book (ISBN,title,Author,description,genre,price,quantity) VALUES (?,?,?,?,?,?,?)";
            connection.query(query,[book.ISBN,book.title,book.Author,book.description,book.genre,book.price,book.quantity],(err,results)=>{
                if(err)
                {
                    res.status(400);
                }
            });
            return res;
            }});
});

//Retrieve book
router.get(['/books/isbn/:ISBN' , '/books/:ISBN'] ,(req,res,next)=> {
    const ISBN = req.params.ISBN;
    var book = req.body;
    connection.query('Select * FROM Book where ISBN = ?', [ISBN], (err, results)=> {
    if (!err) {
        if(results.length == 0) {
            res.status(404);
            res.json({message:'ISBN not found'});
            return res;
        }
        res.status(200).json(results[0]);
    }
});
});

//validating the price fucntion
function validate(num){
    const regexPricePatternU = /^\d+(?:\.\d{1,2})?$/; 
    return regexPricePatternU.test(num);
}

//Update book
router.put('/books/:ISBN', (req,res,next)=> {
    const ISBN = req.params.ISBN;
    const { title, Author, description, genre, price, quantity } = req.body;
    //NULL check
    if(!title || !Author || !description || !genre || !price || !quantity) {
        return res.status(400).json({message:'all fields in the request body are mandatory'});
    }
    //Decimal Check
    const testPriceU =  validate(price);
    if(!testPriceU){
        return res.status(400).json({message: 'price must be a valid number with 2 decimal places'});
    }
    var query = 'UPDATE Book SET title = ?, Author = ?, description = ?, genre = ?, price = ?, quantity = ? WHERE ISBN = ?';
    connection.query(query,[title,Author,description,genre,price,quantity,ISBN],(err, results) => {
        if(!err) {

            if(results.affectedRows == 0){
                return res.status(404).json({message:'ISBN not found'});
            }
            else {
                return res.status(200).json(req.body);
            }
        }
        return res.status(400).json({message:'Illegal input'});
    });
});

module.exports = router;