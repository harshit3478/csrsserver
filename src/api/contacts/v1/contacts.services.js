const { Contact } = require("../../../models/contact.schema");
const { User } = require("../../../models/user.schema");

const addContact = async ({ body }) => {
  try {
    const { id, name, phone } = body;

    const  doesExist = await User.findOne({ _id: id });
    if (!doesExist) {
      return { status: 400, message: "User does not exist" };
    }

    const contactExist = await Contact.findOne({ userId: id, phone: phone });
    if (contactExist) {
      return { status: 400, message: "Contact already exists" };
    }

    const user = await User.findOne({ phone: phone });
    if (user) {
      const contact = await Contact.create({
        userId: id,
        name: name,
        phone: phone,
        isUser: true,
        deviceToken: user.deviceToken,
        imageUrl: user.imageUrl,
      });
      return { status: 200, data: contact };
    }
    const contact = await Contact.create({
      userId: id,
      name: name,
      phone: phone,
      isUser: false,
    });
    return { status: 200, data: contact };
  } catch (error) {
    console.log("add contact ", error);
    return { status: 500, message: error.message };
  }
};

const getContacts = async ({ body }) => {
  try {
    const { id } = body;
    const contacts = await Contact.find({ userId: id });
    return { status: 200, data: contacts };
    }
    catch (error) {
    console.log("get contacts ", error);
    return { status: 500, message: error.message };
    }
}

const deleteContact = async ({ body }) => {
    try {
        const { id, phone } = body;
        const contact = await Contact.findOneAndDelete({ userId: id, phone: phone });
        if (!contact) {
            return { status: 400, message: "Contact does not exist" };
        }
        return { status: 200, message: "Contact deleted successfully" };
    }
    catch (error) {
        console.log("delete contact ", error);
        return { status: 500, message: error.message };
    }
}


const updateContacts = async ({ body }) => {
    try {
        const { id} = body;
        const contacts = await Contact.find({ userId: id });
        contacts.forEach(async (contact) => {
            if(!contact.isUser){
                const user = await User.findOne({ phone:contact.phone });
                if(user){
                    contact.isUser = true;
                    contact.deviceToken = user.deviceToken;
                    contact.imageUrl = user.imageUrl;
                    contact.save();
                }
            }
        }
        );
        return { status: 200, message: "Contacts updated successfully" };
    }
    catch (error) {
        console.log("update contacts ", error);
        return { status: 500, message: error.message };
    }
}

module.exports = {
    addContact,
    getContacts,
    deleteContact,
    updateContacts,
    };