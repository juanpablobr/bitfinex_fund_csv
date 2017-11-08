/**
 * Created by joe on 2017/11/5.
 */
// logic={
//     doAuth:function (key,secret) {
//         const crypto = require('crypto-js');
//
//         const authNonce = Date.now() * 1000;
//         const authPayload = 'AUTH' + authNonce;
//         const authSig = crypto
//             .HmacSHA384(authPayload, secret)
//             .toString(crypto.enc.Hex);
//
//         const payload = {
//             key,
//             authSig,
//             authNonce,
//             authPayload,
//             event: 'auth'
//         };
//
//         g_io.send(ccsp.json.toString(payload));
//     },
//
//     send:function (eventName) {
//         // const authNonce = (new Date()).getTime() * 1000;
//         // const payload = 'AUTH' + authNonce + authNonce;
//         // const signature = crypto.createHmac('sha384', config.apikey.secret).update(payload).digest('hex');
//         // var calc=0;
//         g_io.send({
//             event: eventName,
//             apiKey: config.apikey.key,
//             authSig: signature,
//             authPayload: payload,
//             authNonce: +authNonce + 1,
//             calc
//         })
//     }
// };
