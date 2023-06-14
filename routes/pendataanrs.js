const express = require('express')
const router = express.Router()
const Pendataanrs = require('../models/Pendataanrs')

function result(succ, msg, details) {
    if (details) {
        return {
            success: succ,
            message: msg,
            data: details
        }
    } else {
        return {
            success: succ,
            message: msg,
        }
    }

}
router.get('/', async (req, res) => {
    try {
        const pendataanrs = await Pendataanrs.aggregate([{
                $lookup: {
                    from: 'user',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            {
                $set: {
                    id: '$_id',
                    username: {
                        $arrayElemAt: ['$userData.username', 0]
                    },

                }

            },
            {
                $project: {
                    userData: 0,
                    _id: 0
                }
            }

        ]);
        if (pendataanrs.length > 0) {
            res.status(200).json(result(1, 'Retrieve Data Success', pendataanrs))
        } else {
            res.status(404).json(result(0, 'Zero Data!'))
        }
    } catch (error) {
        res.status(500).json(result(0, error.message))
    }
})
router.post('/', async (req, res) => {
    const inputPendataanrs = new Pendataanrs({
        nama: req.body.nama,
        alamat: req.body.alamat,
        deskripsi: req.body.alamat,
        user_id: req.body.user_id
    })
    try {
        const pendataanrs = await inputPendataanrs.save()
        res.status(200).json(result(1, 'Insert Barang Successful'))

    } catch (error) {
        res.status(500).json(result(0, error.message))
    }
})

router.put('/', async (req, res) => {
    const data = {
        id: req.body.id,
        nama: req.body.nama,
        alamat: req.body.alamat,
        deskripsi: req.body.alamat
    }
    try {
        const pendataanrs = await Pendataanrs.updateOne({
            _id: data.id,
        }, data)

        if (pendataanrs.matchedCount > 0) {
            res.status(200).json(result(1, 'Updated Data Success!'))
        } else {
            res.status(200).json(result(1, 'Updated Data Failed!'))
        }

    } catch (error) {
        res.status(500).json(result(0, error.message))
    }
})
router.delete('/:id', async (req, res) => {
    try {
        const pendataanrs = await Pendataanrs.deleteOne({
            _id: req.params.id
        })
        if (pendataanrs.deletedCount > 0) {
            res.status(200).json(result(1, 'Deleted Data Success!'))
        } else {
            res.status(200).json(result(0, 'Deleted Data Failed!'))
        }
    } catch (error) {
        res.status(500).json(result(0, error.message))
    }

})
module.exports = router