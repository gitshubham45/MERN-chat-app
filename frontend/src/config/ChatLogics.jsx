export const getSender = (loggedUser , users) => {
    console.log(users ,"in getSender");
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
}

export const getSenderFull = (loggedUser , users) => {
    console.log(users,"in getSenderFull");
    return users[0]._id === loggedUser._id ? users[1] : users[0];
};