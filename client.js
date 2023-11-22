const es = require('elasticsearch')
const express = require('express')
const path = require('path')

const app = express()
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

const client = new es.Client({
    hosts: ["http://localhost:9200"]
})

app.get('/', async (req, res) => {
    const body = {
        query: {
            match_all: {}
        },
        _source: [
            "first_name",
            "street_address",
            "city",
            "zip_code"
        ],
        size: 4,
        sort: {
            "record_domain_value_hie_rls_id": {
                "order": "asc"
            }
        }
    }
    try {
        const resp = await client.search({
            index: 'record_domain_value_hie_rls',
            body: body
        })
        const hits = resp.hits.hits
        console.log(hits)
        res.render('index', { hits: hits })
    } catch (error) {
        console.log(error);
    }
    //res.sendFile(path.join(__dirname, '/views/index.html'), {hits: getData()})
})

app.listen('3002', () => {
    console.log("Listening on port 3002")
})