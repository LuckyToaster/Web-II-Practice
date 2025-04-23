class EmailService {
    constructor() {
        if (EmailService._instance) 
            throw new Error('EmailService is a singleton')
        EmailService._instance = this
    }

    sendEmail(email, text) {
        // TODO: IMPLEMENT
        // getHTMLtemplate
        // inject text in html template
        // send mail with the html
    }

    
    sendMockEmail(email, txt) {
        console.log(`Sent email to ${email}: ${txt}`)
    }
}

module.exports = new EmailService()

