var DocumentDBClient = require('documentdb').DocumentClient;
var async = require('async');

function InviteList(inviteDao) {
 this.inviteDao = inviteDao;
}

module.exports = InviteList;

InviteList.prototype = {
     showInvites: function (req, res) {
         var self = this;

         var querySpec = {
             query: 'SELECT * FROM root r WHERE r.completed=@completed',
             parameters: [{
                 name: '@completed',
                 value: false
             }]
         };

         self.inviteDao.find(querySpec, function (err, items) {
             if (err) {
                 throw (err);
             }

             res.render('index', {
                 title: 'My ToDo List ',
                 invites: items
             });
         });
     },

     addInvite: function (req, res) {
         var self = this;
         var item = req.body;

         self.inviteDao.addItem(item, function (err) {
             if (err) {
                 throw (err);
             }

             res.redirect('/');
         });
     },

     completeInvite: function (req, res) {
         var self = this;
         var completedInvites = Object.keys(req.body);

         async.forEach(completedInvites, function inviteIterator(completedInvite, callback) {
             self.inviteDao.updateItem(completedInvite, function (err) {
                 if (err) {
                     callback(err);
                 } else {
                     callback(null);
                 }
             });
         }, function goHome(err) {
             if (err) {
                 throw err;
             } else {
                 res.redirect('/');
             }
         });
     }
 };
