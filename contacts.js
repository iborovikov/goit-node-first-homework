const fs = require('fs/promises')
const path = require('path')
const shortid = require('shortid')

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
  return result
};

const removeContact = async (contactId) => {
  const contacts = await contactsPath();
  const [deletedContact] = contacts.filter(contact => contact.id === contactId);
  const newContactList = contacts.filter(contact => contact.id !== contactId);
  await fs.writeFile(path.join(__dirname, 'db/contacts.json'), JSON.stringify(newContactList, null, 2));
  return deletedContact
};

const addContact = async (name, email, phone) => {
  const contacts = await contactsPath();

  const idGenerator = (id) => {
    if (contacts.find(contact => contact.id === id)) {
      id++
      idGenerator(id)
    }
    return id
  };
  const newContact = {
    id: idGenerator(contacts.length + 1),
    name,
    email,
    phone
  };
  
  contacts.push(newContact);
  await fs.writeFile(path.join(__dirname, 'db/contacts.json'), JSON.stringify(contacts, null, 2));
  return newContact
};

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact
}