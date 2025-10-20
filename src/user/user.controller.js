const user_module = require('./user.modules');
const { sendSuccess, sendError } = require('../utils/responses');

class user_controller extends user_module {
  static create_user = async (req, res) => {
    try {
      const response = await this.save_user_details(req);
      sendSuccess(res, response, 'User created');
    } catch (error) {
      sendError(res, error);
    }
  };

  static get_users = async (req, res) => {
    try {
      const response = await this.reterive_user(req);
      sendSuccess(res, response, 'Users retrieved');
    } catch (error) {
      sendError(res, error);
    }
  };

  static otp_verify = async (req, res) => {
    try {
      const response = await this.verify_user(req);
      if (response.status) {
        sendSuccess(res, response.user, response.message);
      } else {
        res.status(400).send({ success: false, error: 'ValidationError', message: response.message });
      }
    } catch (error) {
      sendError(res, error);
    }
  };
}

module.exports = user_controller;