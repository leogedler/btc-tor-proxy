
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const { SocksProxyAgent } = require('socks-proxy-agent');
const axios = require('axios');
const agent = new SocksProxyAgent('socks5h://localhost:9050');

function axiosTor(body) {
    return axios({
        method: 'POST',
        params: null,
        url: process.env.ONION_URL,
        headers: { 'content-type': 'text/plain' },
        httpAgent: agent,
        auth: {
            username: process.env.USER_NAME,
            password: process.env.PASSWORD
        },
        data: JSON.stringify(body)
    })
}


app.post('/node', async (req, res) => {
    try {
        const response = await axiosTor(req.body);
        return res.json(response.data);
    } catch (error) {
        return res.status(500).json(error);
    }
});



const port = process.env.PORT || 3030;
app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
});
