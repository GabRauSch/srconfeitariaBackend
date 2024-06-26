
// 100 error
// 200 success
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
// 9 sent

export type successKey = 'updated' | 'deleted' | 'created' | 'emailSent'

export const successTypes = {
    updated: {
        code: 202,
        message: "Updated with success",
        successType: 'Database',
        status: 200
    },
    emailSent: {
        code: 279,
        message: "Email sent",
        successType: 'Database',
        status: 200
    },
    deleted: {
        code: 203,
        message: 'Deleted with Success',
        successType: 'Database',
        status: 200
    },
    created: {
        code: 201,
        message: "Created with success",
        successType: 'Database',
        status: 201
    }
}
