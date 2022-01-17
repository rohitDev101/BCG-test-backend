const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const db = require('./services/db')

const app = express();
const port = 3010;

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))
app.get('/', (req,res) => {
    res.send('Hello world!')
})

app.get('/data/:id', (req, res) => {
    db.query('SELECT * FROM insurance_schema.`data set` WHERE Policy_id=' + req.params.id + ' OR Customer_id=' + req.params.id + ' LIMIT 10',
        function (err, rows, fields) {
            if (err) throw err
            res.json(rows)
        })
})

app.get('/data', (req,res) => {
    db.query('SELECT * FROM insurance_schema.`data set` limit 10;', function(err, rows, fields){
        if (err) throw err
            
        res.json(rows)
    })
})
app.get('/visualdata', (req,res) => {
    // db.query("SELECT SUBSTR(`Date of Purchase`,1,2) as month, Customer_Region, COUNT(*) as No_of_customers FROM insurance_schema.`data set` Where Customer_Region='"+req.params.region+"' GROUP BY  SUBSTR(`Date of Purchase`,1,2), Customer_Region ORDER BY 1;", function(err, rows, fields){
    db.query("SELECT SUBSTR(`Date of Purchase`,1,2) as month, Customer_Region, COUNT(*) as No_of_policies FROM insurance_schema.`data set` GROUP BY  SUBSTR(`Date of Purchase`,1,2), Customer_Region ORDER BY 1;", function(err, rows, fields){

        if (err) throw err
        
        res.json(rows)
    })
})

app.post('/updatepolicy', (req, res)=>{
    let body = req.body;
    let columns = Object.keys(body);
    let values = Object.values(body);
    if(columns.length){
        let query = "UPDATE insurance_schema.`data set` SET `" + columns.join("` = ?, `") +"` = ? WHERE Policy_id="+body.Policy_id;
        db.query(query, values, function(err, rows, fields){
            if (err) throw err
            
            res.json({Status: 'Policy data is updated', data: rows})
        })
        // res.send('Status: Policy data is updated');
    } else {
        res.send('Status: something went wrong');
    }

})

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})