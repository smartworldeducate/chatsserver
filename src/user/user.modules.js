const models = require('../models');

class user_module {

    static save_user_details = async (req) => {
        try {
            const payload = req.body;
            const created = await models.users.create(payload);
            return created.toJSON();
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

            const offset = page * limit;
            const { rows, count } = await models.users.findAndCountAll({
                order: [['id', 'DESC']],
                limit,
                offset,
                attributes: { exclude: [] },
            });
            return { users: rows, count, page, limit };
        } catch (error) {
            throw error
        }
    }

    static verify_user = async (req) => {
        try {
            const { otp, user_id } = req.body
            if (otp === '123456') {
                const user = await models.users.findByPk(user_id)
                return { user, status: true, message: 'success' }
            } else {
                return { user: null, status: false, message: 'Otp Invalid' }
            }
        } catch (error) {
            throw error
        }
    }

}

module.exports = user_module