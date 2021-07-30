const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const Core = require("./core");
const ProblemDocument = require('http-problem-details').ProblemDocument;
const User = require("./schema/user");

new Core();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//________________________________________________________________________________________________________________________________________

//   ### Erros HTTP 7807 ###

// user not found
const UserNotFound = new ProblemDocument({
    type: 'https://mongoosejs.com/docs/queries.html',
    title: 'Bad request - Usuário não encontrado',
    detail: 'A chave de id dada não corresponde com nenhum usuário.',
    instance: '/users/',
    status: 400
})

// http 7807 subUser not found
const SubUserNotFound = new ProblemDocument({
    type: 'https://mongoosejs.com/docs/queries.html',
    title: 'Nenhum usuário corresponde com a subUser_id',
    detail: 'A chave de id dada não corresponde com nenhum dado do usuário.',
    instance: '/users/user_id/parents/subUser_id',
    status: 400
})

// http 7807 subSubUser not found
const SubSubUserNotFound = new ProblemDocument({
    type: 'https://mongoosejs.com/docs/queries.html',
    title: 'Nenhum usuário corresponde com a subSubUser_id',
    detail: 'A chave de id dada não corresponde com nenhum dado do usuário.',
    instance: '/users/user_id/parents/subUser_id/parents/subSubUser_id',
    status: 400
})

// http 7807 id already exists
const AlreadyFound = new ProblemDocument({
    type: 'https://mongoosejs.com/docs/queries.html',
    title: 'A id já existe na base de dados',
    detail: 'A chave de id dada já corresponde a um usuário.',
    instance: '/users/user_id/parents/subUser_id/parents/subSubUser_id',
    status: 400
})

//________________________________________________________________________________________________________________________________________

// ### GETs ###

// all users
app.get("/users", async (req, res)=>{
    const user = await User.find();
    return res.status(200).json({
        data: user,
    });
});

// user by id
app.get("/users/:id", async(req, res)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return res.status(400).json(
            UserNotFound);
    }
    return res.status(200).json({
        data: user
    });
});

// get pais
app.get("/users/:id/parents/", async(req, res)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return res.status(400).json(UserNotFound);
    }
    return res.status(200).json({
        data: user.parents
    });
});

// get pai por id
app.get("/users/:id1/parents/:id2", async(req, res)=>{
    const user = await User.findById(req.params.id1);
    if(!user){
        return res.status(400).json(UserNotFound);
    }
    let aux = user.parents
    for (var par in aux) {
        if(aux[par]._id==req.params.id2){
            return res.status(200).json({
                data: aux[par]
            });
        };
    }
    return res.status(400).json(SubUserNotFound)
});

// get avôs
app.get("/users/:id1/parents/:id2/parents", async(req, res)=>{
    const user = await User.findById(req.params.id1);
    if(!user){
        return res.status(400).json(UserNotFound);
    }
    let aux = user.parents
    for (var par in aux) {
        if(aux[par]._id==req.params.id2){
            return res.status(200).json({
                data: aux[par].parents
            });
        };
    };
    return res.status(400).json(SubUserNotFound);
});

// get avô por id
app.get("/users/:id1/parents/:id2/parents/:id3", async(req, res)=>{
    const user = await User.findById(req.params.id1);
    if(!user){
        return res.status(400).json(UserNotFound);
    }
    let aux = user.parents
    for (var par in aux) {
        if(aux[par]._id==req.params.id2){
            let aux2 = aux[par].parents
            for (var par2 in aux2) {
                if(aux2[par2]._id==req.params.id3){
                    return res.status(200).json({
                        data: aux2[par2]
                    });
                };
            };
            return res.status(400).json(SubUserNotFound);
        };
    return res.status(400).json(SubSubUserNotFound);
    }
});

//________________________________________________________________________________________________________________________________________

// ### POSTS ###

// posting user
app.post("/users", async (req, res)=>{
    if((await User.findById(req.body.id))) {
        return res.status(400).json(AlreadyFound);
    }
    const user = {
        name: req.body.name,
        cpf: req.body.cpf,
        parents: req.body.parents
    };
    await (new User(user).save());
    return res.status(200).json({data: user});
});

//________________________________________________________________________________________________________________________________________

// ### PATCHs ###

// patching user by id
app.patch("/users/:id", async(req, res)=>{
    const user = await User.findById(req.params.id);
    if(!user) {
        return res.status(400).json({
            UserNotFound
        });
    }
    await user.updateOne(req.body);
    return res.status(200).json({data: req.body});
});

//________________________________________________________________________________________________________________________________________


// ### DELETE ###

// deleting by id
app.delete("/users/:id", async (req, res)=>{
    return res.status(200).json({
        data: (await User.findOneAndRemove({_id: req.params.id}))
    });
});

//________________________________________________________________________________________________________________________________________

// ### Definir porta ###

// localhost:3000 é a porta.
app.listen(3000, ()=>{
    console.log("Server Started");
});