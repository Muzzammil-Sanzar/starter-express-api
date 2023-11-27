const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"] || req.headers?.authorization?.split(" ")[1];

    // console.log('token: ', token)
    if (!token) {
        return res.status(403).send({ success: false, message: "A token is required for authentication" });
    }

    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        // console.log(decoded)
        req.user_id = decoded.user_id;
    } catch (err) {
        return res.status(401).send({ success: false, error: err.message, message: 'invalid token' });
    }
    return next();
};

function generateTokens(payload) {
    const accessToken = jwt.sign(payload, config.TOKEN_KEY, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, config.TOKEN_REFRESH_KEY, { expiresIn: '7d' });
    return { accessToken, refreshToken };
}

module.exports = verifyToken;