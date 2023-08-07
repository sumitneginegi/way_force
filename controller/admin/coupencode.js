const offerSchema = require('../../models/coupencode'); // Adjust the path as needed
const moment = require('moment');

module.exports.createOffer = async (req, res) => {
    try {
        let { offerName, offerPrice, activationdate, expirydate } = req.body;
        if (!offerName || !offerPrice || !activationdate || !expirydate)
            return res.status(400).json({
                success: false,
                msg: "some fields are missing"
            })

        const offerId = await offerSchema.findOne({ offerName: offerName });
        console.log(offerId);
        if (!offerId) {
            const activationDate = moment(activationdate);
            const expiryDate = moment(expirydate);
            const offerCreated = await offerSchema.create({
                offerName: offerName,
                offerPrice: offerPrice,
                activationdate: activationDate,
                expirydate: expiryDate
            });
            return res.status(201).json({ success: true, offer: offerCreated });

        } else if (offerId.offerName == offerName) {
            return res.status(400).json({ msg: "offer already present" });
        }
    } catch (error) {
        return res.status(400).json({ msg: error.message, name: error.name });
    }
}



exports.uploadImageOfOffer = async (req, res) => {
    try {
        //   let productImage = [];
        //   for (let i = 0; i < req.files.length; i++) {
        //     console.log(req.files[i]);

        const offerModel = await offerSchema.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    uploadImage: req.file.path,
                },
            },
            { new: true }
        );

        const imageuploaded = await offerSchema.findById({
            _id: req.params.id,
        });

        res.status(200).json({
            message: "updated successfully.",
            data: imageuploaded,
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};



module.exports.getAllOffers = async (req, res) => {
    try {
        const allOffers = await offerSchema.find();
        console.log(allOffers);
        if (allOffers) {
            return res.status(200).json({ msg: "success", data: allOffers });
        } else {
            return res.status(400).json({ msg: "No offers added", data: allOffers });
        }
    } catch (error) {
        return res.status(400).json({ msg: error.message, name: error.name });
    }
}

module.exports.updateOffer = async (req, res) => {
    try {
        let { offerPrice, _id } = req.body
        const offer = await offerSchema.findOneAndUpdate({ _id: _id }, {
            $set: {
                offerPrice
            }
        }, { new: true })

        if (offer) {
            return res.status(200).json({ msg: "offer details updated", data: offer });
        } else {
            return res.status(400).json({ msg: "something went wrong" });
        }
    } catch (error) {
        return res.status(400).json({ msg: error.message, name: error.name });
    }
}

exports.deleteOffer = async (req, res) => {
    try {
        const id = req.params.id;
        await offerSchema.deleteOne({ _id: id });
        res.status(200).send({ message: "offer deleted" });
    } catch (err) {
        console.log(err);
        res.status(400).send({ message: err.message });
    }
}
