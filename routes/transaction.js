const express = require("express");
const router = express.Router();
const db = require("./config/mongodb");
const tablename = 'user_account';

router.post('/adduser', function(req, res) {
    const {accountType, accountNumber, username} = req.body;
    //console.log(req.body);
    const newAccount = {
        accountType,
        accountNumber,
        username,
        tnx_inProgress : false,
        balance:0
    }
    const query = { username, accountType};
    db.get().collection(tablename)
    .findOne(query, ((err, dbres) => {
        if (err) {
            return  res.send({error: err, result: "some error occur"});
        } 
        if (dbres){
            return  res.send({errorCode: 1001, result:"user already exists"});
        }
        db.get().collection(tablename)
        .findOne({accountNumber}, ((err, dbres2) => {
            if (err) {
                return  res.send({error: err, result: "some error occur"});
            } 
            if (dbres2){
                return  res.send({errorCode: 1004, result:"account number already exists"});
            }
            db.get().collection(tablename)
            .insert(newAccount, ((err, dbresInsert) => {
                return  res.send({error: err, result: dbresInsert});
            }));
        }));
    }));
});

router.post('/addBalance', function(req, res) {
    const { accountNumber, addBanalce} = req.body;
    //console.log(req.body);
    const query = {accountNumber};
    db.get().collection(tablename)
    .findOne(query, ((err, dbres) => {
        if (err) {
            return  res.send({error: err, result: "some error occur"});
        } 
        if (!dbres){
            return  res.send({errorCode: 1003 , result:"user not exists"});
        }
        const updatedBalance = Number(dbres.balance || 0) + Number(addBanalce || 0);
        const dataUpdate = {$set: {balance : updatedBalance}}
        db.get().collection(tablename)
        .findOneAndUpdate(query, dataUpdate, { upsert: false }, ((err, dbresInsert) => {
            return  res.send({error: err, result: dbresInsert});
        }));
    }));
});

router.post('/transferMoney', function(req, res) {
    const { fromAccountId, toAccountId, amount} = req.body;
    //console.log(req.body);
    const query = {accountNumber: { $in : [fromAccountId, toAccountId]}}
    db.get().collection(tablename)
    .find(query).toArray((async (err, dbres) => {
        if (err) {
            return  res.send({errorCode: 1011, errorMessage: "some error occur"});
        }
        let fromUserRow = null;
        let toUserRow = null 
        if(dbres.length === 2) {
            const fromAccountCheck = dbres.find(row => row.accountNumber === fromAccountId);
            if(!fromAccountCheck){
                return  res.send({errorCode: 1006 , errorMessage:"Account Number not found : "+fromAccountId});
            }
            fromUserRow = fromAccountCheck;
            const toAccountCheck = dbres.find(row => row.accountNumber === toAccountId);
            if(!toAccountCheck){
                return  res.send({errorCode: 1007 , errorMessage:"Account Number not found : "+toAccountId});
            }
            toUserRow = toAccountCheck;
            if(fromUserRow.username === toUserRow.username){
                return  res.send({errorCode: 1009 , errorMessage:"Both account belong to same user"});
            }
        } else {
            return  res.send({errorCode: 1008 , errorMessage:"One of account not found"});
        }
        if(dbres.balance < Number(amount || 0)) {
            return  res.send({errorCode: 1002 , errorMessage:"insufficient Balance"});
        }

        let tnxInProcess = true;
        const timeLimit = new Date().getTime() + 20000;
        while(tnxInProcess && (new Date().getTime() < timeLimit) ){
            query.tnx_inProgress = false;
            const dataUpdate = {$set: {tnx_inProgress : true}};
            await db.get().collection(tablename)
            .findOneAndUpdate(query, dataUpdate, { upsert: false }, ((err, dbresInsert) => {
                if (err) {
                    return  res.send({errorCode: 1012, errorMessage: "some error occur"});
                }
                if (dbresInsert && dbresInsert.lastErrorObject && dbresInsert.lastErrorObject.updatedExisting && dbresInsert.value && !dbresInsert.value.tnx_inProgress){
                    tnxInProcess = false;
                    return;
                }
            }));
            await sleep(500);
        }

        if(!tnxInProcess && fromUserRow && toUserRow){
            const fromUpdateData = {$set : {
                balance : Number(fromUserRow.balance || 0) - Number(amount || 0),
                tnx_inProgress : false
            }}
            db.get().collection(tablename)
            .findOneAndUpdate({accountNumber: fromAccountId}, fromUpdateData, { upsert: false }, ((err, dbresInsert) => {
                if (err) {
                    return  res.send({errorCode: 1012, errorMessage: "some error occur"});
                }
                const toUpdateData = {$set : {
                    balance : Number(toUserRow.balance || 0) + Number(amount || 0),
                }}
                db.get().collection(tablename)
                .findOneAndUpdate({accountNumber : toAccountId }, toUpdateData, { upsert: false }, ((err, dbresInsert) => {
                    if (err) {
                        return  res.send({errorCode: 1012, errorMessage: "some error occur"});
                    }
                    return  res.send({
                        newSrcBalance : fromUpdateData.$set.balance,
                        totalDestBalance : toUpdateData.$set.balance,
                        transferedAt : new Date().getTime()
                    });
                }));
            }));
        }

    }));
});

// router.post('/delRows', function(req, res) {
//     const query = {tnx_inProgress : true};
//     db.get().collection(tablename)
//     .deleteMany(query, ((err, dbres) => {
//         if (err) {
//             return  res.send({error: err, result: "some error occur"});
//         } 
//         return  res.send({success: 200 , result:"done"});
//     }));
// });

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = router;