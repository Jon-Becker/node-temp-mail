const { default: axios } = require("axios");
const nodify = require("./nodify");

/** @typedef {{ from: string, timestamp: string, subject: string, message: string }} Message */
/** @typedef {{ address: string, messageCount: number, messages: Message[] }} EmailFetchResult */

class TempMail {
  /** @type {string} */
  mailingAddressLabel;

  /**
   * create a new instance of TempMail
   * @param {string} mailingAddressLabel mailing address label
   */
  constructor(mailingAddressLabel) {
    this.mailingAddressLabel = mailingAddressLabel;
  }

  /**
   * fetchs emails and returns it
   * @returns {Promise<EmailFetchResult>}
   */
  async #fetchEmails() {
    const httpResponse = await axios.get("https://www.1secmail.com/api/v1/?action=getMessages&login=" + this.mailingAddressLabel + "&domain=1secmail.com");
    const data = httpResponse.data;
    const messages = await Promise.all(data.map(async (email) => {
      const mailHttpResponse = await axios.get("https://www.1secmail.com/api/v1/?action=readMessage&login=" + label + "&domain=1secmail.com&id=" + email.id);
      const mailData = mailHttpResponse.data;
      return {
        from: mailData.from,
        timestamp: mailData.date,
        subject: mailData.subject,
        message: mailData.textBody
      }
    }));
    const res = {
      address: this.mailingAddressLabel + "@1secmail.com",
      messageCount: data.length,
      messages
    };
    return res;
  }

  /**
   * fetchs emails and calls the callback if not provided just returns a promise
   * @param {import("./nodify").callback<EmailFetchResult, Error>} callback callback
   * @returns {Promise<EmailFetchResult>}
   */
  fetchEmails(callback) {
    return nodify(this.#fetchEmails(), callback);
  }

  /**
   * returns the mailing address label
   * @returns {{ address: string }}
   */
  getAddress() {
    return {
      address: this.mailingAddressLabel + "@1secmail.com"
    }
  }
}

module.exports = TempMail;

