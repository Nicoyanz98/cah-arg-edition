const express = require('express');
const router = express.Router();

const Card = require('../models/card.js');

router.get('/black', async (req, res) => {
    await Card.countDocuments({type: 'black'}).exec(async (err, count) => {
        res.json(await Card.findOne({type: 'black'}).skip(Math.floor(Math.random() * count)));
    });
});

router.post('/white/:limit', async (req, res) => {
    var whiteCards = [];
    const deck = req.body.deck;
    await Card.countDocuments({type: 'white'}).exec(async (err, count) => {
        while (whiteCards.length < parseInt(req.params.limit)) {
            var card = await Card.findOne({type: 'white'}).skip(Math.floor(Math.random() * count));
            if (whiteCards.filter(item => item.id == card.id).length == 0 && deck.filter(item => item._id == card.id).length == 0)
                whiteCards.push(card);
        }
        res.json(whiteCards);
    });
});

router.post('/new/:type', async (req, res) => {
    const content = req.body.content;
    await Card.find({type: req.params.type, content: content}, async (err, docs) => {
        if (docs.length) {
            res.json({err: 'The card already exists'});
        } else {
            const card = new Card({
                type: req.params.type,
                content
            });
            await card.save((err, doc) => {
                if (err) console.log(err)
                console.log('Saved')
            })
            res.json(card);
        }
    });
});

module.exports = router;