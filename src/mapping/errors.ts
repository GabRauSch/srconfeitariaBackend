
// 100 error

// 00 database
// 10 server
// 20 auth
// 30 message broker

// 0 generic
// 1 creation
// 2 update
// 3 delete
// 4 register not fond
// 5-9 internal

const errors = {
    internalServerError: {
        code: 117,
        message: "Internal server error caused when $1",
        errorType: 'Server'
    },
    invalidDate: {
        code: 101,
        message: `not a valid date $1`,
        errorType: 'Database'
    },
    notFound: {
        code: 101,
        message: `Not found $1`,
        errorType: 'Server'
    },
    doesntBelong: {
        code: 101,
        message: `$1 doesn't belong to $2`,
        errorType: 'Database'
    },
    noRegister: {
        code: 101,
        message: `No register for '$1'`,
        errorType: 'Database'
    },
    noRegisterWithId: {
        code: 101,
        message: `No regoster for $1 with id $2`,
        errorType: 'Database'
    },
    missingAttributes: {
        code: 101,
        message: `missing attibutes $1`,
        errorType: 'Database'
    },
    invalidAttributes: {
        code: 101,
        message: `No register for $1 with $2,`,
        errorType: 'Database'
    },
    notCreated: {
        code: 101,
        message: `No register for $1 with $2,`,
        errorType: 'Database'
    },
    alreadyExists: {
        code: 101,
        message: `$1 already exists`,
        errorType: 'Database'
    },
    notChanged: {
        code: 101,
        message: `No register for $1 with $2,`,
        errorType: 'Database'
    },
    notDeleted: {
        code: 101,
        message: `Couldn't delete $1`,
        errorType: 'Database'
    },
    notUpdated: {
        code: 101,
        message: `Couldn't update $1`,
        errorType: 'Database'
    },
    notAuthorized: {
        code: 101,
        message: `Not authorized`,
        errorType: 'Auth'
    },
    imageNotUploaded: {
        code: 101,
        message: `Image not uploaded`,
        errorType: 'Server'
    },
    wrongCredential: {
        code: 101,
        message: `Email and/or password don't match`,
        errorType: 'Auth'
    },
    emailNotSent: {
        code: 101,
        message: `Email wasn't sent to $1`,
        errorType: 'Database'
    },
    notSent: {
        code: 101,
        message: `Couldn't send message`,
        errorType: 'Message Broker'
    }
}
const succes = {

}

