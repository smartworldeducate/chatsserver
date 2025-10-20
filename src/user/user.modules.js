const models = require('../models');

class user_module {

    static save_user_details = async (req) => {
        try {
            console.log("req body", req.body)
            const { profileImage } = req.body
            let set_data = req.body
            if (!!profileImage) {
                set_data.profileImage = profileImage
            }
            return await models.users.create(set_data)

        } catch (error) {
            throw error
        }
    }

    static reterive_user = async (req) => {
        try {
            const rawLimit = Number(req.query.limit);
            const rawPage = Number(req.query.pagination);

            const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : 10;
            const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 0; // zero-based page

            const query = {};
            const projection = { __v: 0 };
            const options = {
                lean: true,
                sort: { _id: -1 },
                skip: page * limit,
                limit,
            };

            const [users, count] = await Promise.all([
                models.users.find(query, projection, options),
                models.users.countDocuments(query),
            ]);
            return { users, count, page, limit };
        } catch (error) {
            throw error
        }
    }

    static verify_user = async (req) => {
        try {
            console.log("req body", req.body)
            const { otp, user_id } = req.body
            if(otp == '123456'){
                let user = await models.users.findById(user_id)
                return {user: user, status: true, message: 'success'}
            }else{
                return {user: null, status: false, message: 'Otp Invalid'}
            }

        } catch (error) {
            throw error
        }
    }

}

module.exports = user_module