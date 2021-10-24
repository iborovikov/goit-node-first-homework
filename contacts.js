const fs = require('fs/promises');
const path = require('path');
const chalk = require('chalk');

const contactsPath = async () => {
  const result = await fs.readFile(path.join(__dirname, 'db/contacts.json'), 'utf8');
  return JSON.parse(result)
};

const listContacts = async () => {
  return await contactsPath()
};

const getContactById = async (contactId) => {
  const contacts = await contactsPath();
  const [result] = contacts.filter(contact => contact.id === contactId);

  if (result) {
    console.log(chalk.yellow('Your contact:'))
    return result
  }
  return chalk.red('There is no such contact') 
};

const removeContact = async (contactId) => {
  const contacts = await contactsPath();
  const [deletedContact] = contacts.filter(contact => contact.id === contactId);
  if (!deletedContact) {
    return chalk.red(`Contact dosen't exist`)
  }
  
  const newContactList = contacts.filter(contact => contact.id !== contactId);
  await fs.writeFile(path.join(__dirname, 'db/contacts.json'), JSON.stringify(newContactList, null, 2));

  console.log(chalk.red('Contact was deleted'));
  return deletedContact
};

const addContact = async (name, email, phone) => {
  const contacts = await contactsPath();

  const isCredentialsValid = name !== void 0 && phone !== void 0 && email !== void 0
  const isContackAlreadyExist = contacts.find(contact => contact.name === name || contact.email === email || contact.phone === phone);

  if (isCredentialsValid) {
    if (!isContackAlreadyExist) {
      const idGenerator = () => {
        const now = new Date();
        const id = `${now.getHours()}${now.getMinutes()}${now.getSeconds()}${now.getMilliseconds()}`
        return Number(id)
      }

      const newContact = {
        id: idGenerator(),
        name,
        email,
        phone
      };
  
      contacts.push(newContact);
      await fs.writeFile(path.join(__dirname, 'db/contacts.json'), JSON.stringify(contacts, null, 2));
      console.log(chalk.green(`Add new contact`))
      return newContact
    }
    return chalk.red('Contact already exist')
  }
  return chalk.red('Please enter all contact data')
};

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact
}