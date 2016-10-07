'user strict';
var Contact = require('./model');
var B = require('bluebird');

/**
 *  Adiciona um novo contato para o usuário
 *
 * @param {String} req.email - verifica se ja existe contato com o email
 * @param res
 */
var addContact = function (req, res) {

	Contact.findOne({ email: req.email}, function (err, data) {
		if(err) {
			var err = new Error(err);
			throw err;
		}

		if(data !== null) {
			var message = {
				message: 'Contact already exists'
			};
			res(message);
		} else {
			Contact(req).save( function (err, data) {
				if (err) {
					if (err.name === 'ValidationError') {
						var message = {
							message: 'Verificar campos obrigatorios'
						};

						res(message);
					}
					var err = new Error(err);
					throw err;
				}

				//User successfully created
                var message = {
                    message: 'The contact was created successfully!'
                };
                res(message);
			});
		}
	});
};

/**
 *  Get an contact by email
 *
 * @param {Object} req
 * @param {String} req.email
 * @param res
 */
var findByEmail = function (req, res) {
    Contact.findOne({email: req.email}, function (err, data) {
        if (err) {
            var err = new Error(err);
            throw err;
        }

        if (data !== null) {
            var result = {
                name: data.name,
                email: data.email,
                phone: data.phone,
                userId: data.userId,
                id: data._id
            };

            res(result);
        } else {
            var message = {
                message: 'Contact not found.'
            };
            res(message);
        }

    });
};

/**
 *  Get an contact by id
 *
 * @param {Object} req
 * @param {String} req.id
 * @param res
 */
var findById = function (req, res) {

    var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");

    if(checkForHexRegExp.test(req.id)) {
        Contact.findById(req.id, function (err, data) {
            if (err) {
                var err = new Error(err);
                throw err;
            }

            if (data !== null) {
                var result = {
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    userId: data.userId,
                    id: data._id
                };

                res(result);
            } else {
                var message = {
                    message: 'Contact not found.'
                };
                res(message);
            }

        });
    }
};

/**
 *  Update contact
 *
 * @param {Object} req._id
 * @param {String} req.dados
 * @param res
 */
var updateContact = function (req, res) {

    var novo = {
        email: req.email,
        name: req.name,
        lastName: req.lastName,
        phone: req.phone,
        userId: req.userId
    };

    Contact.findOneAndUpdate({_id:req._id}, { $set: novo },{new:true}, function(err, data) {
        if(err) {
            var result = "";
            if (err.code) {
                switch (err.code) {
                    case 11000:
                    case 11001:
                        result = "Dados duplicados.";
                        break;
                    default:
                        result = 'Erro ao atualizar contato.';
                }
            }
            var message = {
                message: result
            };

            res(message);
            return;
        }

        if(data) {
            res({message:"Contato atualizado."});
        } else {
            res({message:"Contato não localizado."});
        }
    });
};

var getAllByUser = function (req, res) {
    Contact.find({userId: req.userId}, function(err, docs) {
        if (!err){
            res(docs);
        } else {throw err;}
    });
};

/**
 *  Remove a user account
 *
 * @param {Object} req
 * @param {String} req.email
 * @param {Function} res - Callback
 */
var remove = function (req, res) {

    Contact.findOneAndRemove({_id: req.id}, function (err, data) {
        if (err) {
            var err = new Error(err);
            throw err;
        }
        var message;
        if (data) {
            message = {
                message: 'The contact was removed successfully!'
            };

        } else {
            message = {
                message: 'Contact not found!'
            };
        }

        res(message);
    });

};

module.exports = {
    addContact : addContact,
    updateContact : updateContact,
    findByEmail: findByEmail,
    findById: findById,
    getAllByUser: getAllByUser,
    remove: remove
};