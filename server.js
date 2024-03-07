const express = require('express')
const mongoose = require('mongoose')
const {checkSchema , validationResult} = require('express-validator')
const app = express()

app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/library-app')
    .then(() =>{
        console.log('Successfully connected to db')
    })
    .catch(() =>{
        console.log('Error connecting to db')
    })

const {Schema,model} = mongoose
const memberSchema = new Schema({
    name: String,/*{
        type: String,
        required: true
    },*/
    address: String,
    mobile: String,
    email: String,
    gender: String
},{timestamps: true})

const Member = model('Member',memberSchema)

//validation
const memberValidationSchema = {
    name: {
        notEmpty: {
            errorMessage: 'member name is required'
        }
    },
    email: {
        notEmpty: {
            errorMessage: 'email is required'
        },
        isEmail: {
            errorMessage: 'invalid email format'
        }
    },
    mobile: {
        notEmpty: {
            errorMessage: 'mobile is required'
        },
        isLength: {
            options: { min: 10, max: 10 },
            errorMessage: 'mobile should be 10 digits'
        },
        isNumeric: {
            errorMessage: 'mobile should contain only numbers'
        }
    },
    gender: {
        notEmpty: {
            errorMessage: 'gender should be selected'
        }, 
        isIn: {
            options: [['male','female','other']],
            errorMessage: 'gender should selected from the given list'
        }
    }
}

//create
app.post('/api/members',checkSchema(memberValidationSchema),(req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    const {body} = req
    const m1 = new Member(body)
    m1.save() 
        .then((mem)=>{
            res.json(mem)
        })
        .catch((err) => {
            res.json(err)
        })
})

//display-all
app.get('/api/members',(req,res) => {
    Member.find()
        .then((mem)=>{
            res.json(mem)
        })
        .catch((err) => {
            res.json(err)
        })
})

//update
app.put('/api/members/:id',checkSchema(memberValidationSchema),(req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    const id = req.params.id
    const {body} = req
    Member.findByIdAndUpdate(id,body, {new: true, runValidators:true}) 
        .then((mem)=>{
            res.json(mem)
        })
        .catch((err) => {//500--internal server error
            res.status(500).json(err)
        })
})

//delete
app.delete('/api/members/:id',(req,res) => {
    const id = req.params.id
    Member.findByIdAndDelete(id)
        .then((mem)=>{
            res.json(mem)
        })
        .catch((err) => {
            res.json(err)
        })
})

//view one
app.get('/api/members/:id',(req,res) => {
    const id = req.params.id
    Member.findById(id)
        .then((mem)=>{
            res.json(mem)
        })
        .catch((err) => {
            res.json(err)
        })
})


const bookSchema = new Schema({
    bookName: String,
    isbn: String,
    authorName: String,
    category: String,
    decription: String,
    status: String
},{timestamps: true})

const Book = model('Book',bookSchema)

//validations
const bookValidationSchema = {
    bookName: {
        notEmpty: {
            errorMessage: 'Book name is required'
        }
    },
    isbn: {
        notEmpty: {
            errorMessage: 'Isbn is required'
        },
        isISBN: {
            errorMessage: 'Isbn number must be valid'
        }
    },
    authorName: {
        notEmpty: {
            errorMessage: 'Author name is required'
        }
    },
    category: {
        notEmpty: {
            errorMessage: 'Category is required'
        }
    },
    description: {
        notEmpty: {
            errorMessage: 'Book name is required'
        },
        isLength: {
            options: {min: 50},
            errorMessage: 'description must contain alteast 50 words'
        }
    },
    status: {
        notEmpty: {
            errorMessage: 'status is required'
        },
        isIn: {
            options: [['available','borrowed','over due']],
            errorMessage: 'select only from the given list'
        }
    },
}

//create book
app.post('/api/books',checkSchema(bookValidationSchema),(req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    const {body} = req
    const b1 = new Book(body)
    b1.save() 
        .then((book)=>{
            res.json(book)
        })
        .catch((err) => {
            res.json(err)
        })
})

//display-all books
app.get('/api/books',(req,res) => {
    Book.find()
        .then((book)=>{
            res.json(book)
        })
        .catch((err) => {
            res.json(err)
        })
})

//update a book
app.put('/api/books/:id',checkSchema(bookValidationSchema),(req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    const id = req.params.id
    const {body} = req
    Book.findByIdAndUpdate(id,body, {new: true/* runValidators:true*/}) 
        .then((book)=>{
            res.json(book)
        })
        .catch((err) => {
            res.json(err)
        })
})

//delete book
app.delete('/api/books/:id',(req,res) => {
    const id = req.params.id
    Book.findByIdAndDelete(id)
        .then((book)=>{
            res.json(book)
        })
        .catch((err) => {
            res.json(err)
        })
})


app.listen(3008,() => {
    console.log('server is running on port 3008')
})
