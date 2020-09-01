const router = require('express').Router()
const customerModel = require('../models/Customer.model')
const shopModel = require('../models/Shop.model')

router.route('/login').post(async(req, res)=>{
    const query = {
        email: req.body.email,
        password: req.body.password,
        isCustomer: req.body.isCustomer
    }
    
    var customer = (req.body.isCustomer === 'true')
    
    try {
        // console.log(query);
        let user = {}
        if(customer) {
            user = await customerModel.findOne({email_id: query['email'], password: query['password']})
        } else {
            user = await shopModel.findOne({email_id: query.email, password: query.password})
        }
        // console.log(user);
        res.status(200).json(user)
    } catch (error) {
        res.json(error)
    }
})

router.route('/register').post((req,res)=>{
    let newUser = {}
    var isCustomer = (req.body.isCustomer==='true');
    if(isCustomer) {
        newUser = new customerModel({
            name: req.body.name,
            email_id: req.body.email,
            password: req.body.password,
            phone: req.body.phone
        })
    } else {
        newUser = new shopModel({
            name: req.body.name,
            email_id: req.body.email,
            password: req.body.password,
            address: req.body.address,
            phone: req.body.phone,
            license: req.body.license
        })
    }

    newUser.save((error, user) => {
        if (error) {
            res.json(error)
        } else {
            res.json(user)
            // res.json("Successfully Registered")
        }
    })
})

router.route('/:id').get(async(req, res) => {
    let user = {}
    try {
        user = await customerModel.findById(req.params.id)
        if(user === null) {
            user = await shopModel.findById(req.params.id)
        }
        let data = [user]
        let dataObj = {data}
        res.json(dataObj)
    } catch(error) {
        res.json(error)
    }
})

router.route('/profile/update/:id').post(async (req,res)=>{

    //right now i am thinking that only user is updating its profile
    //i assuming customer can change its name,password and phone no
    //he/she can't change its email-id
    let user = {};

    try{
        user = await customerModel.findById(req.params.id);

        console.log("User inside customer profile update route")
        console.log(user);

        // res.status(200).json(user);

        var newName = user.name;
        var newPhone = user.phone;
        var newPassword = user.password;


        if(req.body.name!==null && req.body.name!==undefined && req.body.name.length>0){
            newName = req.body.name;
        }


        if(req.body.phone!==null && req.body.phone!==undefined && req.body.phone.length>0){
            newPhone = req.body.phone;
        }


        if(req.body.password!==null && req.body.password!==undefined && req.body.password.length>0){
            newPassword = req.body.password;
        }



        var Query = { _id: req.params.id };
        var updateValue = { $set: { name: newName , phone: newPhone, password:newPassword} };


        customerModel.updateOne(Query,updateValue,(err,response)=>{
            if(err){
                throw err;
                // return;
            }

            
        })

        res.json({"Success":"Customer Profile has been updated successfully"});

    }catch(error){
        res.status(404).json(error);
    }

})

module.exports = router