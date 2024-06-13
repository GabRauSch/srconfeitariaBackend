
// 100 error
// 300 error with identifies

// 00 database
// 10 server
// 20 auth
// 30 message broker
// 40 io error
// 50 logic
// 60 file
// 70 external

// 0 generic
// 1 creation
// 2 update
// 3 delete
// 4 not fond
// 5 invalid
// 6 logic
// 7 internal
// 8 duplicate

export type errorKey = 'internalServerError' | 'invalidDate' | 'notFound' | 'doesntBelong' | 'noRegister' 
| 'noRegisterWithId' | 'missingAttributes' | 'invalidAttributes' | 'notCreated' 
| 'alreadyExists' | 'notDeleted' | 'notUpdated' | 'notAuthorized' | 'imageNotUploaded' 
| 'wrongCredential' | 'emailNotSent' | 'notSent' | 'databaseError' | 'invalid'

export const errorsTypes = {
    databaseError: {
        code: 107,
        message: "Database error",
        errorType: 'Database',
        status: 400
    },
    internalServerError: {
        code: 117,
        message: "Internal server error caused when $1",
        errorType: 'Server',
        status: 500
    },
    invalidDate: {
        code: 155,
        message: `not a valid date $1`,
        errorType: 'Database',
        status: 400
    },
    notFound: {
        code: 114,
        message: `Not found $1`,
        errorType: 'Server',
        status: 404
    },
    
    invalid: {
        code: 1000,
        message: `Invalid $1 because it $2`,
        errorType: 'Server',
        status: 400
    },
    doesntBelong: {
        code: 106,
        message: `'$1' doesn't belong to '$2'`,
        errorType: 'Database',
        status: 400
    },
    noRegister: {
        code: 104,
        message: `No register for '$1'`,
        errorType: 'Database',
        status: 404
    },
    noRegisterWithId: {
        code: 304,
        message: `No register for '$1' with id $2`,
        errorType: 'Database',
        status: 404
    },
    missingAttributes: {
        code: 144,
        message: `missing attibutes $1`,
        errorType: 'InOut',
        status: 400
    },
    invalidAttributes: {
        code: 145,
        message: `Invalid attributes $2`,
        errorType: 'InOut',
        status: 400
    },
    notCreated: {
        code: 101,
        message: `$1 couldn't be created`,
        errorType: 'Database',
        status: 400
    },
    alreadyExists: {
        code: 108,
        message: `$1 already exists with this $2`,
        errorType: 'Database',
        status: 400
    },
    notDeleted: {
        code: 103,
        message: `Couldn't delete $1`,
        errorType: 'Database',
        status: 400
    },
    notUpdated: {
        code: 102,
        message: `Couldn't update $1`,
        errorType: 'Database',
        status: 400
    },
    notAuthorized: {
        code: 120,
        message: `Not authorized`,
        errorType: 'Auth',
        status: 401
    },
    imageNotUploaded: {
        code: 161,
        message: `Image not uploaded`,
        errorType: 'File',
        status: 400
    },
    wrongCredential: {
        code: 146,
        message: `Email and/or password don't match`,
        errorType: 'Auth',
        status: 400
    },
    emailNotSent: {
        code: 171,
        message: `Email wasn't sent to $1`,
        errorType: 'Database',
        status: 400
    },
    notSent: {
        code: 131,
        message: `Couldn't send message`,
        errorType: 'Message Broker',
        status: 400
    }
}
