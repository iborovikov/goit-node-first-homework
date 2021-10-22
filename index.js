const { Command } = require('commander');
const { listContacts, getContactById, removeContact, addContact } = require('./contacts');
const chalk = require('chalk');
const program = new Command();
program
  .option('-a, --action <type>', 'choose action')
  .option('-i, --id <type>', 'user id')
  .option('-n, --name <type>', 'user name')
  .option('-e, --email <type>', 'user email')
  .option('-p, --phone <type>', 'user phone');

program.parse(process.argv);

const argv = program.opts();


; (async ({ action, id, name, email, phone }) => {
    try {
        switch (action) {
          case 'list':
                const contacts = await listContacts()
                console.table(contacts)
            break;
      
          case 'get':
            const contactById = await getContactById(Number(id))
            console.log(chalk.yellow('Here is your contact'))
            console.log(contactById)
            break;
      
          case 'add':
            const addedContact = await addContact(name, email, phone)
            console.log(chalk.green('Add new contact'))
            console.log(addedContact)
            break;
      
          case 'remove':
            const deletedContact = await removeContact(Number(id))
            console.log(chalk.red('Contact was deleted'))
            console.log(deletedContact)
            break;
      
          default:
            console.warn(chalk.red('Unknown action type!'));
        }
        
    } catch (error) {
        console.error(chalk.red(error.message))
    }
})(argv)