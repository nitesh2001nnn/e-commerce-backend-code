const express= require("express");
const cors=require("cors");
require("./db/config");
const app = express();
const Signupuser= require("./db/Signup")
const Product= require("./db/Product");
app.use(express.json());
app.use(cors());
const jwt=require('jsonwebtoken');
const jwtkey ="e-comm";
app.post("/signup",async(req,resp)=>{
    const signupuser= new Signupuser(req.body);
    let result= await signupuser.save();
    result=result.toObject();
    delete result.password;
    jwt.sign({result},jwtkey,{expiresIn:"1h"},(err,token)=>{
        if(err){
            resp.send({result:"NO user found"});

        }
        resp.send({result,auth:token})
    })
    
});
app.post("/login",async(req,resp)=>{
    if(req.body.password && req.body.email){
        let user=await Signupuser.findOne(req.body).select("-password");
        if(user){
            jwt.sign({user},jwtkey,{expiresIn:"1h"},(err,token)=>{
                if(err){
                    resp.send({user:"NO user found"});

                }
                resp.send({user,auth:token})
            })
           
        }
        else{
            resp.send("no user found")
        }

    }
    else{
        resp.send("no user found")
    }
})

app.post("/add-product",Verifytoken,async(req,resp)=>{
    let product = new Product(req.body);
    let result = await product.save();
    resp.send(result);
})

app.get("/products", Verifytoken,async(req,resp)=>{
    let products = await Product.find();
    if(products.length>0){
        resp.send(products);
    }else{
        resp.send({result:"no products found"});
    }
})
app.delete("/product/:id",async(req,resp)=>{
    const result=await Product.deleteOne({_id:req.params.id});
    resp.send(result);
})
app.get("/product/:id",async(req,resp)=>{
    const result= await Product.findOne({_id:req.params.id})
    if(result){
        resp.send(result);
    }else{
        resp.send({result:"no product found"})
    }
})
app.put("/product/:id",async(req,resp)=>{
    let result=await Product.updateOne({_id:req.params.id},{
        $set:req.body
    })
    resp.send(result);
})

app.get("/search/:key",async(req,resp)=>{
    let result = await Product.find({
        "$or":[
            
                {name:{$regex:req.params.key}},
                {category:{$regex:req.params.key}}
            
        ]
    })
    resp.send(result);
})

function Verifytoken(req,resp,next){
    let token=req.headers['authorization'];
    if(token){
        token=token.split(' ')[1];
        jwt.verify(token,jwtkey,(err,valid)=>{
            if(err){
                resp.status(404).send({result:"please provide valid token"});
            }
            else{
                next();
            }
        })
    }
    else{
        resp.send({result:"please add token with headers"})
    }
}
app.listen(5000);