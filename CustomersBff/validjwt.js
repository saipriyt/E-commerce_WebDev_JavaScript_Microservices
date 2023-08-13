
const authToken = (req, res, next)=>{
    const header = req.headers.authorization;
    if(!header){
        return res.status(401).json({message: 'JWT token is not present'});
    }
    const token = header.split(' ')[1];
    if(!token){
        return res.status(401).json({message: 'JWT token is not valid'});
    }
    //To decode and parse it as JSON Object
    const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

    const subNames = ['starlord', 'gamora', 'drax', 'rocket', 'groot'];

    if(!decoded.sub && !decoded.exp && !decoded.iss){
        return res.status(401).json({message: 'given information is incomplete' });
    }

    if((subNames.includes(decoded.sub)) && (decoded.exp * 1000 > Date.now()) && (decoded.iss === 'cmu.edu')){
        next();
    }
    else{
        return res.status(401).json({message: 'JWT token doesnt satisfy the conditions mentioned' });
    }
};

module.exports = authToken;